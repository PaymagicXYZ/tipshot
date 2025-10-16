import 'server-only';

import { PrivyClient } from '@privy-io/node';
import { createViemAccount } from '@privy-io/node/viem';
import { to7702SimpleSmartAccount } from 'permissionless/accounts';
import { createSmartAccountClient } from 'permissionless';
import { createPimlicoClient } from 'permissionless/clients/pimlico';
import { env } from '../config/env';
import { base } from 'viem/chains';
import { createPublicClient, http } from 'viem';
import { entryPoint07Address } from 'viem/account-abstraction';
import { supabaseClient } from '../config/supabaseClient';

const pimlicoApiKey = env.PIMLICO_API_KEY;

const bundlerUrl = `https://api.pimlico.io/v2/${base.id}/rpc?apikey=${pimlicoApiKey}`;
const paymasterUrl = `https://api.pimlico.io/v2/${base.id}/rpc?apikey=${pimlicoApiKey}`;

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

class PrivyWalletServices {
  private client: PrivyClient;

  constructor() {
    this.client = new PrivyClient({
      appId: env.NEXT_PUBLIC_PRIVY_APP_ID,
      appSecret: env.PRIVY_APP_SECRET,
    });
  }

  async createSmartAccount({ eventId }: { eventId: number }) {
    try {
      // Step 1: Create EVM wallet
      const wallet = await this.client
        .wallets()
        .create({ chain_type: 'ethereum' });

      console.log('✅ Created EOA wallet:', wallet.address);
      console.log('Wallet ID:', wallet.id);

      const address = wallet.address as `0x${string}`;

      // Step 2: Set up EIP-7702 smart account client
      const { smartAccountClient, eoaAccount } =
        await this.getSmartAccountClient({
          privyWalletId: wallet.id,
          address,
        });

      // Ensure the EOA account supports signAuthorization (EIP-7702)
      if (!eoaAccount.signAuthorization) {
        throw new Error(
          'EOA account does not support EIP-7702 signAuthorization',
        );
      }

      // Step 3: Send initial transaction with EIP-7702 authorization
      console.log('Setting up EIP-7702 authorization...');

      // Get the Simple Account implementation address for Base
      const simpleAccountImplementation =
        '0xe6Cae83BdE06E4c305530e199D7217f42808555B' as const;

      const result = await smartAccountClient.sendTransaction({
        to: address, // Send to self
        value: BigInt(0),
        data: '0x',
        authorization: await eoaAccount.signAuthorization({
          address: simpleAccountImplementation,
          chainId: base.id,
          nonce: await publicClient.getTransactionCount({
            address: address,
          }),
        }),
      });

      // Extract the transaction hash (it might be an object with an id property)
      const transactionHash =
        typeof result === 'object' && result && 'id' in result
          ? (result as { id: string }).id
          : (result as string);

      console.log('✅ EIP-7702 smart account activated!');
      console.log('Transaction Hash:', transactionHash);
      console.log(
        `View on BaseScan: https://basescan.org/tx/${transactionHash}`,
      );

      // Save wallet to database
      const { data: savedWallet, error: dbError } = await supabaseClient
        .from('token_toss_wallets')
        .insert({
          address,
          event_id: eventId,
          privy_id: wallet.id,
          tx_hash: transactionHash,
        })
        .select()
        .single();

      if (dbError) {
        console.error('Error saving wallet to database:', dbError);
        throw dbError;
      }

      console.log('✅ Wallet saved to database:', savedWallet);

      // With EIP-7702, the EOA address IS the smart account address
      return {
        eventId,
        privyWalletId: wallet.id,
        address, // Single address for both EOA and smart account
        transactionHash,
        walletId: savedWallet.id,
      };
    } catch (error) {
      console.error('Error creating smart account:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw error;
    }
  }

  async sendBatchedTransactions({
    privyWalletId,
    address,
    calls,
  }: {
    privyWalletId: string;
    address: `0x${string}`;
    calls: Array<{
      to: `0x${string}`;
      value?: bigint;
      data?: `0x${string}`;
    }>;
  }) {
    try {
      const { smartAccountClient } = await this.getSmartAccountClient({
        privyWalletId,
        address,
      });

      console.log('EOA address (7702):', address);
      console.log('Smart account address:', smartAccountClient.account.address);
      console.log('Sending batched transactions...');

      // EIP-7702 authorization was set during account creation
      // So we can directly send batched transactions using sendCalls
      const result = await smartAccountClient.sendCalls({
        calls: calls.map((call) => ({
          to: call.to,
          value: call.value ?? BigInt(0),
          data: call.data ?? '0x',
        })),
      });

      // Extract the transaction hash (it might be an object with an id property)
      const transactionHash =
        typeof result === 'object' && result && 'id' in result
          ? (result as { id: string }).id
          : (result as string);

      console.log('✅ Batched transactions sent!');
      console.log('Transaction Hash:', transactionHash);
      console.log(
        `View on BaseScan: https://basescan.org/tx/${transactionHash}`,
      );

      return {
        bundleId: transactionHash,
      };
    } catch (error) {
      console.error('Error sending batched transactions:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw error;
    }
  }

  private async getSmartAccountClient({
    privyWalletId,
    address,
  }: {
    privyWalletId: string;
    address: `0x${string}`;
  }) {
    // Step 1: Create viem account for the EOA wallet
    const eoaAccount = createViemAccount(this.client, {
      walletId: privyWalletId,
      address: address,
    });

    // Step 2: Create EIP-7702 smart account
    // The EOA address becomes the smart account address!
    const simple7702Account = await to7702SimpleSmartAccount({
      client: publicClient,
      owner: eoaAccount,
    });

    console.log('EIP-7702 Smart Account Address:', simple7702Account.address);

    // Step 3: Create Pimlico paymaster client for gas sponsorship
    const pimlicoClient = createPimlicoClient({
      chain: base,
      transport: http(paymasterUrl),
      entryPoint: {
        address: entryPoint07Address,
        version: '0.7',
      },
    });

    // Step 4: Create smart account client with Pimlico bundler and paymaster
    const smartAccountClient = createSmartAccountClient({
      account: simple7702Account,
      chain: base,
      paymaster: pimlicoClient,
      bundlerTransport: http(bundlerUrl),
      userOperation: {
        estimateFeesPerGas: async () => {
          const gasPrice = await pimlicoClient.getUserOperationGasPrice();
          return gasPrice.fast;
        },
      },
    });

    return {
      smartAccountClient,
      eoaAccount,
    };
  }
}

export const privyWalletServices = new PrivyWalletServices();
