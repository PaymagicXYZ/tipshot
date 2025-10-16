export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "11.2.0 (c820efb)"
  }
  public: {
    Tables: {
      actions: {
        Row: {
          actionDisplayWording: string | null
          actionId: string | null
          actionTimestamp: string | null
          actionType: string | null
          contentUrl: string | null
          createdAt: string | null
          day: string | null
          pointAmount: number | null
          reactionHash: string
          recipientAddress: string | null
          recipientAvatarUrl: string | null
          recipientDisplayName: string | null
          recipientFid: number | null
          recipientName: string | null
          senderAvatarUrl: string | null
          senderDisplayName: string | null
          senderFid: number | null
          senderName: string | null
          updatedAt: string | null
        }
        Insert: {
          actionDisplayWording?: string | null
          actionId?: string | null
          actionTimestamp?: string | null
          actionType?: string | null
          contentUrl?: string | null
          createdAt?: string | null
          day?: string | null
          pointAmount?: number | null
          reactionHash: string
          recipientAddress?: string | null
          recipientAvatarUrl?: string | null
          recipientDisplayName?: string | null
          recipientFid?: number | null
          recipientName?: string | null
          senderAvatarUrl?: string | null
          senderDisplayName?: string | null
          senderFid?: number | null
          senderName?: string | null
          updatedAt?: string | null
        }
        Update: {
          actionDisplayWording?: string | null
          actionId?: string | null
          actionTimestamp?: string | null
          actionType?: string | null
          contentUrl?: string | null
          createdAt?: string | null
          day?: string | null
          pointAmount?: number | null
          reactionHash?: string
          recipientAddress?: string | null
          recipientAvatarUrl?: string | null
          recipientDisplayName?: string | null
          recipientFid?: number | null
          recipientName?: string | null
          senderAvatarUrl?: string | null
          senderDisplayName?: string | null
          senderFid?: number | null
          senderName?: string | null
          updatedAt?: string | null
        }
        Relationships: []
      }
      activities: {
        Row: {
          actionDisplayWording: string | null
          actionId: string | null
          actionType: string | null
          amount: number | null
          asset: string | null
          contentUrl: string | null
          created_at: string
          dstChainId: number | null
          id: number
          points: number | null
          reactionHash: string | null
          recipientAddress: string | null
          recipientAvatarUrl: string | null
          recipientDisplayName: string | null
          recipientFid: number | null
          recipientName: string | null
          senderAvatarUrl: string | null
          senderDisplayName: string | null
          senderFid: number | null
          senderName: string | null
          srcChainId: number | null
          txHash: string | null
          txStatus: Database["public"]["Enums"]["tx_status"] | null
          user_id: number | null
          warpcast_url: string | null
        }
        Insert: {
          actionDisplayWording?: string | null
          actionId?: string | null
          actionType?: string | null
          amount?: number | null
          asset?: string | null
          contentUrl?: string | null
          created_at?: string
          dstChainId?: number | null
          id?: number
          points?: number | null
          reactionHash?: string | null
          recipientAddress?: string | null
          recipientAvatarUrl?: string | null
          recipientDisplayName?: string | null
          recipientFid?: number | null
          recipientName?: string | null
          senderAvatarUrl?: string | null
          senderDisplayName?: string | null
          senderFid?: number | null
          senderName?: string | null
          srcChainId?: number | null
          txHash?: string | null
          txStatus?: Database["public"]["Enums"]["tx_status"] | null
          user_id?: number | null
          warpcast_url?: string | null
        }
        Update: {
          actionDisplayWording?: string | null
          actionId?: string | null
          actionType?: string | null
          amount?: number | null
          asset?: string | null
          contentUrl?: string | null
          created_at?: string
          dstChainId?: number | null
          id?: number
          points?: number | null
          reactionHash?: string | null
          recipientAddress?: string | null
          recipientAvatarUrl?: string | null
          recipientDisplayName?: string | null
          recipientFid?: number | null
          recipientName?: string | null
          senderAvatarUrl?: string | null
          senderDisplayName?: string | null
          senderFid?: number | null
          senderName?: string | null
          srcChainId?: number | null
          txHash?: string | null
          txStatus?: Database["public"]["Enums"]["tx_status"] | null
          user_id?: number | null
          warpcast_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          cast_data: Json
          created_at: string
          fid_casthash: string
          id: number
          user_fid: number
        }
        Insert: {
          cast_data: Json
          created_at?: string
          fid_casthash: string
          id?: number
          user_fid: number
        }
        Update: {
          cast_data?: Json
          created_at?: string
          fid_casthash?: string
          id?: number
          user_fid?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_bookmarks_user_fid_fkey"
            columns: ["user_fid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["fid"]
          },
        ]
      }
      bullpost_generals: {
        Row: {
          created_at: string
          description: string | null
          display_name: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          pfp: string | null
          platform: Database["public"]["Enums"]["tip_game_platform"]
          rank: string | null
          username: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name?: string | null
          id: string
          is_active?: boolean
          is_featured?: boolean
          pfp?: string | null
          platform?: Database["public"]["Enums"]["tip_game_platform"]
          rank?: string | null
          username: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          pfp?: string | null
          platform?: Database["public"]["Enums"]["tip_game_platform"]
          rank?: string | null
          username?: string
        }
        Relationships: []
      }
      bullpost_notifications: {
        Row: {
          action_url: string | null
          created_at: string
          expires_at: string | null
          id: number
          message: string
          metadata: Json | null
          status: Database["public"]["Enums"]["bullpost_notification_status"]
          title: string
          type: Database["public"]["Enums"]["bullpost_notification_type"]
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: number
          message: string
          metadata?: Json | null
          status?: Database["public"]["Enums"]["bullpost_notification_status"]
          title: string
          type: Database["public"]["Enums"]["bullpost_notification_type"]
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: number
          message?: string
          metadata?: Json | null
          status?: Database["public"]["Enums"]["bullpost_notification_status"]
          title?: string
          type?: Database["public"]["Enums"]["bullpost_notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bullpost_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "bullpost_users"
            referencedColumns: ["id"]
          },
        ]
      }
      bullpost_soldiers: {
        Row: {
          created_at: string
          general_id: string
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          general_id: string
          id?: number
          user_id: string
        }
        Update: {
          created_at?: string
          general_id?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bullpost_soldiers_general_id_fkey"
            columns: ["general_id"]
            isOneToOne: false
            referencedRelation: "bullpost_generals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bullpost_soldiers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "bullpost_users"
            referencedColumns: ["id"]
          },
        ]
      }
      bullpost_tweets: {
        Row: {
          author_name: string | null
          author_pfp: string | null
          author_user_id: string
          author_username: string
          created_at: string
          gig_id: number
          id: string
          metadata: Json
          photos: string[] | null
          text: string
          tweet_created_at_ms: number
          tweet_url: string
          videos: string[] | null
        }
        Insert: {
          author_name?: string | null
          author_pfp?: string | null
          author_user_id: string
          author_username: string
          created_at?: string
          gig_id: number
          id: string
          metadata: Json
          photos?: string[] | null
          text: string
          tweet_created_at_ms: number
          tweet_url: string
          videos?: string[] | null
        }
        Update: {
          author_name?: string | null
          author_pfp?: string | null
          author_user_id?: string
          author_username?: string
          created_at?: string
          gig_id?: number
          id?: string
          metadata?: Json
          photos?: string[] | null
          text?: string
          tweet_created_at_ms?: number
          tweet_url?: string
          videos?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "bullpost_tweets_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs"
            referencedColumns: ["id"]
          },
        ]
      }
      bullpost_users: {
        Row: {
          access_token: string
          access_token_expires_at_ms: number
          created_at: string
          display_name: string | null
          embedded_address: string
          id: string
          metadata: Json
          pfp: string | null
          refresh_token: string
          safe_address: string | null
          username: string
        }
        Insert: {
          access_token: string
          access_token_expires_at_ms: number
          created_at?: string
          display_name?: string | null
          embedded_address: string
          id: string
          metadata: Json
          pfp?: string | null
          refresh_token: string
          safe_address?: string | null
          username: string
        }
        Update: {
          access_token?: string
          access_token_expires_at_ms?: number
          created_at?: string
          display_name?: string | null
          embedded_address?: string
          id?: string
          metadata?: Json
          pfp?: string | null
          refresh_token?: string
          safe_address?: string | null
          username?: string
        }
        Relationships: []
      }
      dune_analytics: {
        Row: {
          created_at: string
          id: number
          total_gigs: number
          total_gmv: number
          total_transactions: number
          unique_earners: number
        }
        Insert: {
          created_at?: string
          id?: number
          total_gigs: number
          total_gmv: number
          total_transactions: number
          unique_earners: number
        }
        Update: {
          created_at?: string
          id?: number
          total_gigs?: number
          total_gmv?: number
          total_transactions?: number
          unique_earners?: number
        }
        Relationships: []
      }
      ethm_beaconcha: {
        Row: {
          balance: number
          created_at: string
          id: number
          performance_total: number
          performance1d: number | null
          performance31d: number | null
          performance365d: number | null
          performance7d: number | null
          performancetoday: number | null
          rank7d: number | null
          validator: string
          validator_index: number | null
        }
        Insert: {
          balance: number
          created_at?: string
          id?: number
          performance_total: number
          performance1d?: number | null
          performance31d?: number | null
          performance365d?: number | null
          performance7d?: number | null
          performancetoday?: number | null
          rank7d?: number | null
          validator: string
          validator_index?: number | null
        }
        Update: {
          balance?: number
          created_at?: string
          id?: number
          performance_total?: number
          performance1d?: number | null
          performance31d?: number | null
          performance365d?: number | null
          performance7d?: number | null
          performancetoday?: number | null
          rank7d?: number | null
          validator?: string
          validator_index?: number | null
        }
        Relationships: []
      }
      ethm_eth: {
        Row: {
          created_at: string
          id: number
          price: number
          price24h: number
          price30d: number
          total_supply: number
        }
        Insert: {
          created_at?: string
          id?: number
          price: number
          price24h: number
          price30d: number
          total_supply: number
        }
        Update: {
          created_at?: string
          id?: number
          price?: number
          price24h?: number
          price30d?: number
          total_supply?: number
        }
        Relationships: []
      }
      ethm_strategic_reserve: {
        Row: {
          change30d: number
          created_at: string
          eth: number
          id: number
          nav: number
          target: number
        }
        Insert: {
          change30d: number
          created_at?: string
          eth: number
          id?: number
          nav: number
          target: number
        }
        Update: {
          change30d?: number
          created_at?: string
          eth?: number
          id?: number
          nav?: number
          target?: number
        }
        Relationships: []
      }
      ethm_yahoo: {
        Row: {
          cash: number
          created_at: string
          enterprise_value: number
          ethm_price: number
          id: number
          mcap: number
          name: string
          ticker: string
          volume: number
        }
        Insert: {
          cash: number
          created_at?: string
          enterprise_value: number
          ethm_price: number
          id?: number
          mcap: number
          name: string
          ticker: string
          volume: number
        }
        Update: {
          cash?: number
          created_at?: string
          enterprise_value?: number
          ethm_price?: number
          id?: number
          mcap?: number
          name?: string
          ticker?: string
          volume?: number
        }
        Relationships: []
      }
      farcaster_apps: {
        Row: {
          app_link: string | null
          created_at: string
          description: string | null
          how_to_play: string | null
          id: number
          image: string | null
          link_to_channel: string | null
          name: string | null
          notion_id: string | null
          order: number | null
          published: boolean | null
          tags: string[] | null
        }
        Insert: {
          app_link?: string | null
          created_at?: string
          description?: string | null
          how_to_play?: string | null
          id?: number
          image?: string | null
          link_to_channel?: string | null
          name?: string | null
          notion_id?: string | null
          order?: number | null
          published?: boolean | null
          tags?: string[] | null
        }
        Update: {
          app_link?: string | null
          created_at?: string
          description?: string | null
          how_to_play?: string | null
          id?: number
          image?: string | null
          link_to_channel?: string | null
          name?: string | null
          notion_id?: string | null
          order?: number | null
          published?: boolean | null
          tags?: string[] | null
        }
        Relationships: []
      }
      gigbot_agents: {
        Row: {
          created_at: string
          description: string | null
          display_name: string | null
          id: number
          pfp: string | null
          url: string
          username: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name?: string | null
          id?: number
          pfp?: string | null
          url: string
          username: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string | null
          id?: number
          pfp?: string | null
          url?: string
          username?: string
        }
        Relationships: []
      }
      gigbot_automated_actions: {
        Row: {
          created_at: string
          enabled: boolean
          gig_type: string
          id: number
          platform: Database["public"]["Enums"]["tip_game_platform"]
          user_id: number
        }
        Insert: {
          created_at?: string
          enabled: boolean
          gig_type?: string
          id?: number
          platform: Database["public"]["Enums"]["tip_game_platform"]
          user_id: number
        }
        Update: {
          created_at?: string
          enabled?: boolean
          gig_type?: string
          id?: number
          platform?: Database["public"]["Enums"]["tip_game_platform"]
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_automated_actions_gig_type_fkey"
            columns: ["gig_type"]
            isOneToOne: false
            referencedRelation: "gigbot_gig_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_automated_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_automated_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_automated_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_automated_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_automated_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_automated_gig_log: {
        Row: {
          created_gig_id: number | null
          failure_reason: string | null
          id: number
          processed_at: string
          processing_status: string
          rule_id: number
          transaction_hash: string | null
          triggering_tweet_id: string
          triggering_tweet_url: string
        }
        Insert: {
          created_gig_id?: number | null
          failure_reason?: string | null
          id?: number
          processed_at?: string
          processing_status: string
          rule_id: number
          transaction_hash?: string | null
          triggering_tweet_id: string
          triggering_tweet_url: string
        }
        Update: {
          created_gig_id?: number | null
          failure_reason?: string | null
          id?: number
          processed_at?: string
          processing_status?: string
          rule_id?: number
          transaction_hash?: string | null
          triggering_tweet_id?: string
          triggering_tweet_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_automated_gig_log_created_gig_id_fkey"
            columns: ["created_gig_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_automated_gig_log_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "gigbot_automated_gig_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_automated_gig_rules: {
        Row: {
          created_at: string
          creator_user_id: number
          gig_creation_config: Json
          id: number
          is_active: boolean
          platform: Database["public"]["Enums"]["tip_game_platform"]
          rule_name: string
          sponsor_account_username: string
          trigger_account_username: string
          trigger_config: Json
          trigger_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_user_id: number
          gig_creation_config: Json
          id?: number
          is_active?: boolean
          platform?: Database["public"]["Enums"]["tip_game_platform"]
          rule_name: string
          sponsor_account_username: string
          trigger_account_username: string
          trigger_config: Json
          trigger_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_user_id?: number
          gig_creation_config?: Json
          id?: number
          is_active?: boolean
          platform?: Database["public"]["Enums"]["tip_game_platform"]
          rule_name?: string
          sponsor_account_username?: string
          trigger_account_username?: string
          trigger_config?: Json
          trigger_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_automated_gig_rules_creator_user_id_fkey"
            columns: ["creator_user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_automated_gig_rules_creator_user_id_fkey"
            columns: ["creator_user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_automated_gig_rules_creator_user_id_fkey"
            columns: ["creator_user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_automated_gig_rules_creator_user_id_fkey"
            columns: ["creator_user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_automated_gig_rules_creator_user_id_fkey"
            columns: ["creator_user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_automated_tasks: {
        Row: {
          created_at: string
          gig_id: number
          id: number
          platform: Database["public"]["Enums"]["social_platform"]
          user_id: number
        }
        Insert: {
          created_at?: string
          gig_id: number
          id?: number
          platform?: Database["public"]["Enums"]["social_platform"]
          user_id: number
        }
        Update: {
          created_at?: string
          gig_id?: number
          id?: number
          platform?: Database["public"]["Enums"]["social_platform"]
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_automated_tasks_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_automated_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_automated_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_automated_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_automated_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_automated_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_automation_credentials: {
        Row: {
          created_at: string
          farcaster_id: number | null
          farcaster_signer_uuid: string | null
          id: number
          user_id: number
          x_access_token: string | null
          x_access_token_expires_at: number | null
          x_id: string | null
          x_refresh_token: string | null
        }
        Insert: {
          created_at?: string
          farcaster_id?: number | null
          farcaster_signer_uuid?: string | null
          id?: number
          user_id: number
          x_access_token?: string | null
          x_access_token_expires_at?: number | null
          x_id?: string | null
          x_refresh_token?: string | null
        }
        Update: {
          created_at?: string
          farcaster_id?: number | null
          farcaster_signer_uuid?: string | null
          id?: number
          user_id?: number
          x_access_token?: string | null
          x_access_token_expires_at?: number | null
          x_id?: string | null
          x_refresh_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_automation_credentials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_automation_credentials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_automation_credentials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_automation_credentials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_automation_credentials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_badge_definitions: {
        Row: {
          created_at: string | null
          criteria: Json | null
          description: string | null
          id: number
          is_active: boolean | null
          name: string
          rank: number | null
          type: Database["public"]["Enums"]["gigbot_badge_type"]
        }
        Insert: {
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          rank?: number | null
          type: Database["public"]["Enums"]["gigbot_badge_type"]
        }
        Update: {
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          rank?: number | null
          type?: Database["public"]["Enums"]["gigbot_badge_type"]
        }
        Relationships: []
      }
      gigbot_blacklisted_users: {
        Row: {
          created_at: string
          id: number
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          user_id: number
        }
        Update: {
          created_at?: string
          id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_blacklisted_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_blacklisted_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_blacklisted_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_blacklisted_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_blacklisted_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_blocked_gig_creators: {
        Row: {
          blocked_user_id: number
          blocker_user_id: number
          created_at: string
          id: number
        }
        Insert: {
          blocked_user_id: number
          blocker_user_id: number
          created_at?: string
          id?: number
        }
        Update: {
          blocked_user_id?: number
          blocker_user_id?: number
          created_at?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_users_block_blocked_user_id_fkey"
            columns: ["blocked_user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_users_block_blocked_user_id_fkey"
            columns: ["blocked_user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_users_block_blocked_user_id_fkey"
            columns: ["blocked_user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_users_block_blocked_user_id_fkey"
            columns: ["blocked_user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_users_block_blocked_user_id_fkey"
            columns: ["blocked_user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_users_block_blocker_user_id_fkey"
            columns: ["blocker_user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_users_block_blocker_user_id_fkey"
            columns: ["blocker_user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_users_block_blocker_user_id_fkey"
            columns: ["blocker_user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_users_block_blocker_user_id_fkey"
            columns: ["blocker_user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_users_block_blocker_user_id_fkey"
            columns: ["blocker_user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_categorized_users: {
        Row: {
          created_at: string
          engagement_percentile: number | null
          engagement_score: number | null
          farcaster_id: number | null
          farcaster_username: string | null
          id: number
          score_class: string | null
          twitter_id: string | null
          twitter_username: string | null
          updated_at: string | null
          user_id: number | null
        }
        Insert: {
          created_at?: string
          engagement_percentile?: number | null
          engagement_score?: number | null
          farcaster_id?: number | null
          farcaster_username?: string | null
          id?: number
          score_class?: string | null
          twitter_id?: string | null
          twitter_username?: string | null
          updated_at?: string | null
          user_id?: number | null
        }
        Update: {
          created_at?: string
          engagement_percentile?: number | null
          engagement_score?: number | null
          farcaster_id?: number | null
          farcaster_username?: string | null
          id?: number
          score_class?: string | null
          twitter_id?: string | null
          twitter_username?: string | null
          updated_at?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_categorized_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_categorized_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_categorized_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_categorized_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_categorized_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_chains: {
        Row: {
          chain_id: number | null
          created_at: string
          explorer_url: string
          id: number
          image_url: string
          is_evm_compatible: boolean
          name: string
          native_asset: string
          native_asset_coingecko_id: string
          native_asset_decimals: number
        }
        Insert: {
          chain_id?: number | null
          created_at?: string
          explorer_url: string
          id?: number
          image_url: string
          is_evm_compatible?: boolean
          name: string
          native_asset: string
          native_asset_coingecko_id: string
          native_asset_decimals: number
        }
        Update: {
          chain_id?: number | null
          created_at?: string
          explorer_url?: string
          id?: number
          image_url?: string
          is_evm_compatible?: boolean
          name?: string
          native_asset?: string
          native_asset_coingecko_id?: string
          native_asset_decimals?: number
        }
        Relationships: []
      }
      gigbot_claimed_tips_badges: {
        Row: {
          created_at: string
          id: number
          mascot_idx: number | null
          tips_ids: number[] | null
          total_usd_amount: number
          user_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          mascot_idx?: number | null
          tips_ids?: number[] | null
          total_usd_amount: number
          user_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          mascot_idx?: number | null
          tips_ids?: number[] | null
          total_usd_amount?: number
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_claimed_tips_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_claimed_tips_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_claimed_tips_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_claimed_tips_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_claimed_tips_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_completed_tasks: {
        Row: {
          bot_reply_cast_hash: string | null
          completed_at: number
          created_at: string
          display_name: string | null
          gig_id: number | null
          gig_type: string
          id: number
          metadata: Json
          pfp_url: string | null
          platform: Database["public"]["Enums"]["tip_game_platform"]
          platform_user_id: string
          processed_at: number | null
          tip_id: number | null
          user_id: number | null
          username: string | null
        }
        Insert: {
          bot_reply_cast_hash?: string | null
          completed_at: number
          created_at?: string
          display_name?: string | null
          gig_id?: number | null
          gig_type: string
          id?: number
          metadata?: Json
          pfp_url?: string | null
          platform: Database["public"]["Enums"]["tip_game_platform"]
          platform_user_id: string
          processed_at?: number | null
          tip_id?: number | null
          user_id?: number | null
          username?: string | null
        }
        Update: {
          bot_reply_cast_hash?: string | null
          completed_at?: number
          created_at?: string
          display_name?: string | null
          gig_id?: number | null
          gig_type?: string
          id?: number
          metadata?: Json
          pfp_url?: string | null
          platform?: Database["public"]["Enums"]["tip_game_platform"]
          platform_user_id?: string
          processed_at?: number | null
          tip_id?: number | null
          user_id?: number | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_completed_tasks_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_completed_tasks_gig_type_fkey"
            columns: ["gig_type"]
            isOneToOne: false
            referencedRelation: "gigbot_gig_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_completed_tasks_tip_id_fkey"
            columns: ["tip_id"]
            isOneToOne: false
            referencedRelation: "gigbot_tips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_completed_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_completed_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_completed_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_completed_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_completed_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_customers: {
        Row: {
          created_at: string
          email: string
          id: number
          metadata: Json | null
          name: string
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          metadata?: Json | null
          name: string
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          metadata?: Json | null
          name?: string
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
        }
        Relationships: []
      }
      gigbot_customers_api_keys: {
        Row: {
          allowed_origins: string[] | null
          created_at: string
          customer_id: number
          expires_at: string | null
          id: number
          key_value: string
          rate_limit: number | null
          rate_limit_window: Database["public"]["Enums"]["rate_window"] | null
          scopes: string[] | null
          status: Database["public"]["Enums"]["api_key_status"]
        }
        Insert: {
          allowed_origins?: string[] | null
          created_at?: string
          customer_id: number
          expires_at?: string | null
          id?: number
          key_value: string
          rate_limit?: number | null
          rate_limit_window?: Database["public"]["Enums"]["rate_window"] | null
          scopes?: string[] | null
          status?: Database["public"]["Enums"]["api_key_status"]
        }
        Update: {
          allowed_origins?: string[] | null
          created_at?: string
          customer_id?: number
          expires_at?: string | null
          id?: number
          key_value?: string
          rate_limit?: number | null
          rate_limit_window?: Database["public"]["Enums"]["rate_window"] | null
          scopes?: string[] | null
          status?: Database["public"]["Enums"]["api_key_status"]
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_customers_api_keys_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "gigbot_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_customers_api_keys_activity: {
        Row: {
          api_key_id: number
          created_at: string
          customer_id: number
          id: number
          ip_address: string | null
          origin: string | null
          request_method: string
          request_payload: Json
          request_url: string
          response_error: string | null
          response_status: number
        }
        Insert: {
          api_key_id: number
          created_at?: string
          customer_id: number
          id?: number
          ip_address?: string | null
          origin?: string | null
          request_method: string
          request_payload: Json
          request_url: string
          response_error?: string | null
          response_status: number
        }
        Update: {
          api_key_id?: number
          created_at?: string
          customer_id?: number
          id?: number
          ip_address?: string | null
          origin?: string | null
          request_method?: string
          request_payload?: Json
          request_url?: string
          response_error?: string | null
          response_status?: number
        }
        Relationships: []
      }
      gigbot_embedded_wallets_txs: {
        Row: {
          created_at: string
          id: number
          tx_hash: string
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          tx_hash: string
          user_id: number
        }
        Update: {
          created_at?: string
          id?: number
          tx_hash?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_embedded_wallets_txs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_embedded_wallets_txs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_embedded_wallets_txs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_embedded_wallets_txs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_embedded_wallets_txs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_expo_notifications_users: {
        Row: {
          created_at: string
          device: string | null
          token: string
          updated_at: string
          user_id: number
        }
        Insert: {
          created_at?: string
          device?: string | null
          token: string
          updated_at?: string
          user_id: number
        }
        Update: {
          created_at?: string
          device?: string | null
          token?: string
          updated_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_expo_notifications_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_expo_notifications_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_expo_notifications_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_expo_notifications_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_expo_notifications_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_external_completed_tasks: {
        Row: {
          api_key_id: number
          created_at: string
          customer_id: number
          gig_id: number
          id: number
          platform_user_id: string
          tip_id: number
        }
        Insert: {
          api_key_id: number
          created_at?: string
          customer_id: number
          gig_id: number
          id?: number
          platform_user_id: string
          tip_id: number
        }
        Update: {
          api_key_id?: number
          created_at?: string
          customer_id?: number
          gig_id?: number
          id?: number
          platform_user_id?: string
          tip_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_external_completed_tasks_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "gigbot_customers_api_keys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_external_completed_tasks_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "gigbot_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_external_completed_tasks_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_external_completed_tasks_tip_id_fkey"
            columns: ["tip_id"]
            isOneToOne: false
            referencedRelation: "gigbot_tips"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_farcaster_notifications_users: {
        Row: {
          created_at: string
          fid: number
          token: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string
          fid?: number
          token?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string
          fid?: number
          token?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      gigbot_gig_analytics_reports: {
        Row: {
          analytics_data: Json | null
          created_at: string
          dm_sent_at: string | null
          gig_id: number
          id: number
          platform: Database["public"]["Enums"]["tip_game_platform"]
          recipient_user_id: number
        }
        Insert: {
          analytics_data?: Json | null
          created_at?: string
          dm_sent_at?: string | null
          gig_id: number
          id?: number
          platform: Database["public"]["Enums"]["tip_game_platform"]
          recipient_user_id: number
        }
        Update: {
          analytics_data?: Json | null
          created_at?: string
          dm_sent_at?: string | null
          gig_id?: number
          id?: number
          platform?: Database["public"]["Enums"]["tip_game_platform"]
          recipient_user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_gig_analytics_reports_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: true
            referencedRelation: "gigbot_gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_gig_analytics_reports_recipient_user_id_fkey"
            columns: ["recipient_user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_gig_analytics_reports_recipient_user_id_fkey"
            columns: ["recipient_user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_gig_analytics_reports_recipient_user_id_fkey"
            columns: ["recipient_user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_gig_analytics_reports_recipient_user_id_fkey"
            columns: ["recipient_user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_gig_analytics_reports_recipient_user_id_fkey"
            columns: ["recipient_user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_gig_transactions: {
        Row: {
          admin_commission_tx_hash: string | null
          admin_commission_tx_status:
            | Database["public"]["Enums"]["tx_status"]
            | null
          admin_gas_funding_tx_hash: string | null
          admin_gas_funding_tx_status:
            | Database["public"]["Enums"]["tx_status"]
            | null
          amount: string
          chain_id: number
          commission_amount: string
          created_at: string
          gig_id: number
          id: number
          token_id: number
          user_funding_tx_hash: string | null
          user_funding_tx_status:
            | Database["public"]["Enums"]["tx_status"]
            | null
        }
        Insert: {
          admin_commission_tx_hash?: string | null
          admin_commission_tx_status?:
            | Database["public"]["Enums"]["tx_status"]
            | null
          admin_gas_funding_tx_hash?: string | null
          admin_gas_funding_tx_status?:
            | Database["public"]["Enums"]["tx_status"]
            | null
          amount: string
          chain_id: number
          commission_amount: string
          created_at?: string
          gig_id: number
          id?: number
          token_id: number
          user_funding_tx_hash?: string | null
          user_funding_tx_status?:
            | Database["public"]["Enums"]["tx_status"]
            | null
        }
        Update: {
          admin_commission_tx_hash?: string | null
          admin_commission_tx_status?:
            | Database["public"]["Enums"]["tx_status"]
            | null
          admin_gas_funding_tx_hash?: string | null
          admin_gas_funding_tx_status?:
            | Database["public"]["Enums"]["tx_status"]
            | null
          amount?: string
          chain_id?: number
          commission_amount?: string
          created_at?: string
          gig_id?: number
          id?: number
          token_id?: number
          user_funding_tx_hash?: string | null
          user_funding_tx_status?:
            | Database["public"]["Enums"]["tx_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_reward_transactions_chain_id_fkey"
            columns: ["chain_id"]
            isOneToOne: false
            referencedRelation: "gigbot_chains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_reward_transactions_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_reward_transactions_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "gigbot_tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_reward_transactions_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "gigbot_tokens_with_prices"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_gig_types: {
        Row: {
          category: string | null
          description: string
          display: Json | null
          id: string
          production: boolean
          required_params: Json
          ui_order_id: number
        }
        Insert: {
          category?: string | null
          description: string
          display?: Json | null
          id: string
          production?: boolean
          required_params: Json
          ui_order_id?: number
        }
        Update: {
          category?: string | null
          description?: string
          display?: Json | null
          id?: string
          production?: boolean
          required_params?: Json
          ui_order_id?: number
        }
        Relationships: []
      }
      gigbot_gigs: {
        Row: {
          action_params: Json
          amount: string
          chain_id: number
          created_at: string
          creator_address: string | null
          duration_ms: number
          earning_criteria: string | null
          end_time_ms: number
          external_url: string | null
          gig_type: string
          gigbot_transactions_id: number | null
          how_to_earn: string | null
          id: number
          is_swept: boolean | null
          notification_sended: boolean | null
          payout_interval_ms: number
          platform: Database["public"]["Enums"]["tip_game_platform"]
          privy_wallet_address: string | null
          privy_wallet_id: string | null
          production: boolean
          source: string | null
          start_time_ms: number
          task_processing_status:
            | Database["public"]["Enums"]["task_status"]
            | null
          ticker: string | null
          token_id: number
          total_balance: string | null
          usd_amount: number | null
          usd_amount_fee: number | null
          usd_amount_total: number | null
          user_id: number | null
          verifier: string | null
        }
        Insert: {
          action_params?: Json
          amount: string
          chain_id: number
          created_at?: string
          creator_address?: string | null
          duration_ms: number
          earning_criteria?: string | null
          end_time_ms: number
          external_url?: string | null
          gig_type?: string
          gigbot_transactions_id?: number | null
          how_to_earn?: string | null
          id?: number
          is_swept?: boolean | null
          notification_sended?: boolean | null
          payout_interval_ms?: number
          platform?: Database["public"]["Enums"]["tip_game_platform"]
          privy_wallet_address?: string | null
          privy_wallet_id?: string | null
          production?: boolean
          source?: string | null
          start_time_ms: number
          task_processing_status?:
            | Database["public"]["Enums"]["task_status"]
            | null
          ticker?: string | null
          token_id: number
          total_balance?: string | null
          usd_amount?: number | null
          usd_amount_fee?: number | null
          usd_amount_total?: number | null
          user_id?: number | null
          verifier?: string | null
        }
        Update: {
          action_params?: Json
          amount?: string
          chain_id?: number
          created_at?: string
          creator_address?: string | null
          duration_ms?: number
          earning_criteria?: string | null
          end_time_ms?: number
          external_url?: string | null
          gig_type?: string
          gigbot_transactions_id?: number | null
          how_to_earn?: string | null
          id?: number
          is_swept?: boolean | null
          notification_sended?: boolean | null
          payout_interval_ms?: number
          platform?: Database["public"]["Enums"]["tip_game_platform"]
          privy_wallet_address?: string | null
          privy_wallet_id?: string | null
          production?: boolean
          source?: string | null
          start_time_ms?: number
          task_processing_status?:
            | Database["public"]["Enums"]["task_status"]
            | null
          ticker?: string | null
          token_id?: number
          total_balance?: string | null
          usd_amount?: number | null
          usd_amount_fee?: number | null
          usd_amount_total?: number | null
          user_id?: number | null
          verifier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_gigs_chain_id_fkey"
            columns: ["chain_id"]
            isOneToOne: false
            referencedRelation: "gigbot_chains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_gigs_gig_type_fkey"
            columns: ["gig_type"]
            isOneToOne: false
            referencedRelation: "gigbot_gig_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_gigs_gigbot_transactions_id_fkey"
            columns: ["gigbot_transactions_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gig_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_gigs_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "gigbot_tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_gigs_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "gigbot_tokens_with_prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_gigs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_gigs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_gigs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_gigs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_gigs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_gigs_reports: {
        Row: {
          created_at: string
          gig_id: number
          id: number
          reason: string
          user_id: number
        }
        Insert: {
          created_at?: string
          gig_id: number
          id?: number
          reason: string
          user_id: number
        }
        Update: {
          created_at?: string
          gig_id?: number
          id?: number
          reason?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_reported_gigs_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_reported_gigs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_reported_gigs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_reported_gigs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_reported_gigs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_reported_gigs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_ineligible_tasks: {
        Row: {
          created_at: string | null
          eligibility_rules_applied: Json | null
          gig_id: number
          id: number
          ineligibility_reasons: string[] | null
          platform: Database["public"]["Enums"]["social_platform"]
          platform_user_id: string
          user_id: number | null
          user_metadata_snapshot: Json | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          eligibility_rules_applied?: Json | null
          gig_id: number
          id?: number
          ineligibility_reasons?: string[] | null
          platform: Database["public"]["Enums"]["social_platform"]
          platform_user_id: string
          user_id?: number | null
          user_metadata_snapshot?: Json | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          eligibility_rules_applied?: Json | null
          gig_id?: number
          id?: number
          ineligibility_reasons?: string[] | null
          platform?: Database["public"]["Enums"]["social_platform"]
          platform_user_id?: string
          user_id?: number | null
          user_metadata_snapshot?: Json | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_ineligible_tasks_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_ineligible_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_ineligible_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_ineligible_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_ineligible_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_ineligible_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_kv: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      gigbot_leaderboard: {
        Row: {
          claimed_tokens: Json | null
          completed_tasks: number | null
          created_at: string
          farcaster_username: string | null
          id: number
          pending_claims: number
          success_claims: number
          total_usd_amount: number
          twitter_username: string | null
          user_id: number
        }
        Insert: {
          claimed_tokens?: Json | null
          completed_tasks?: number | null
          created_at?: string
          farcaster_username?: string | null
          id?: number
          pending_claims?: number
          success_claims?: number
          total_usd_amount?: number
          twitter_username?: string | null
          user_id: number
        }
        Update: {
          claimed_tokens?: Json | null
          completed_tasks?: number | null
          created_at?: string
          farcaster_username?: string | null
          id?: number
          pending_claims?: number
          success_claims?: number
          total_usd_amount?: number
          twitter_username?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_notification_settings: {
        Row: {
          created_at: string
          enabled: boolean
          fc_enabled: boolean | null
          gig_type: string
          id: number
          instagram_enabled: boolean | null
          onchain_enabled: boolean | null
          user_id: number
          x_enabled: boolean | null
          youtube_enabled: boolean | null
        }
        Insert: {
          created_at?: string
          enabled: boolean
          fc_enabled?: boolean | null
          gig_type: string
          id?: number
          instagram_enabled?: boolean | null
          onchain_enabled?: boolean | null
          user_id: number
          x_enabled?: boolean | null
          youtube_enabled?: boolean | null
        }
        Update: {
          created_at?: string
          enabled?: boolean
          fc_enabled?: boolean | null
          gig_type?: string
          id?: number
          instagram_enabled?: boolean | null
          onchain_enabled?: boolean | null
          user_id?: number
          x_enabled?: boolean | null
          youtube_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_notification_settings_gig_type_fkey"
            columns: ["gig_type"]
            isOneToOne: false
            referencedRelation: "gigbot_gig_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_notification_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_notification_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_notification_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_notification_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_notification_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_notifications: {
        Row: {
          created_at: string
          display_name: string | null
          id: number
          last_notified_at: string
          platform: Database["public"]["Enums"]["tip_game_platform"]
          platform_user_id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: number
          last_notified_at?: string
          platform: Database["public"]["Enums"]["tip_game_platform"]
          platform_user_id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: number
          last_notified_at?: string
          platform?: Database["public"]["Enums"]["tip_game_platform"]
          platform_user_id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      gigbot_privy_admin_wallets: {
        Row: {
          address: string
          chain: string
          created_at: string
          description: string | null
          environment: string
          id: number
          wallet_id: string
        }
        Insert: {
          address: string
          chain: string
          created_at?: string
          description?: string | null
          environment?: string
          id?: number
          wallet_id: string
        }
        Update: {
          address?: string
          chain?: string
          created_at?: string
          description?: string | null
          environment?: string
          id?: number
          wallet_id?: string
        }
        Relationships: []
      }
      gigbot_stripe_customers: {
        Row: {
          cancel_at_period_end: boolean
          canceled_at: string | null
          created_at: string
          current_period_end: string
          current_period_start: string
          customer_id: string
          id: string
          price_id: string
          product_id: string
          start_date: string
          status: Database["public"]["Enums"]["stripe_subscription_status"]
          updated_at: string
          user_id: number
        }
        Insert: {
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          current_period_end: string
          current_period_start: string
          customer_id: string
          id: string
          price_id: string
          product_id: string
          start_date: string
          status: Database["public"]["Enums"]["stripe_subscription_status"]
          updated_at: string
          user_id: number
        }
        Update: {
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          customer_id?: string
          id?: string
          price_id?: string
          product_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["stripe_subscription_status"]
          updated_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_stripe_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_stripe_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_stripe_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_stripe_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_stripe_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_stripe_prices: {
        Row: {
          active: boolean
          created_at: string
          currency: string
          id: string
          interval: string
          interval_count: number
          price_metadata: Json
          product_id: string
          stripe_metadata: Json
          unit_amount_cents: number
          updated_at: string
        }
        Insert: {
          active: boolean
          created_at?: string
          currency: string
          id: string
          interval: string
          interval_count: number
          price_metadata: Json
          product_id: string
          stripe_metadata: Json
          unit_amount_cents: number
          updated_at: string
        }
        Update: {
          active?: boolean
          created_at?: string
          currency?: string
          id?: string
          interval?: string
          interval_count?: number
          price_metadata?: Json
          product_id?: string
          stripe_metadata?: Json
          unit_amount_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_stripe_prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "gigbot_stripe_products"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_stripe_products: {
        Row: {
          active: boolean
          created_at: string
          default_price_id: string | null
          description: string | null
          id: string
          livemode: boolean
          name: string
          product_metadata: Json | null
          stripe_metadata: Json | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          active: boolean
          created_at?: string
          default_price_id?: string | null
          description?: string | null
          id: string
          livemode: boolean
          name: string
          product_metadata?: Json | null
          stripe_metadata?: Json | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          default_price_id?: string | null
          description?: string | null
          id?: string
          livemode?: boolean
          name?: string
          product_metadata?: Json | null
          stripe_metadata?: Json | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      gigbot_tips: {
        Row: {
          claim_nonce: string | null
          claim_started_at: string | null
          claimed_at: string | null
          created_at: string
          gig_id: number
          id: number
          pfp_url: string | null
          platform: Database["public"]["Enums"]["social_platform"] | null
          platform_user_id: string
          status: Database["public"]["Enums"]["tx_status"]
          token_id: number
          tx_hash: string | null
          usd_amount: string | null
          user_address: string | null
          user_id: number | null
          username: string | null
          value: number
        }
        Insert: {
          claim_nonce?: string | null
          claim_started_at?: string | null
          claimed_at?: string | null
          created_at?: string
          gig_id: number
          id?: number
          pfp_url?: string | null
          platform?: Database["public"]["Enums"]["social_platform"] | null
          platform_user_id: string
          status?: Database["public"]["Enums"]["tx_status"]
          token_id: number
          tx_hash?: string | null
          usd_amount?: string | null
          user_address?: string | null
          user_id?: number | null
          username?: string | null
          value: number
        }
        Update: {
          claim_nonce?: string | null
          claim_started_at?: string | null
          claimed_at?: string | null
          created_at?: string
          gig_id?: number
          id?: number
          pfp_url?: string | null
          platform?: Database["public"]["Enums"]["social_platform"] | null
          platform_user_id?: string
          status?: Database["public"]["Enums"]["tx_status"]
          token_id?: number
          tx_hash?: string | null
          usd_amount?: string | null
          user_address?: string | null
          user_id?: number | null
          username?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_tips_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_tips_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "gigbot_tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_tips_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "gigbot_tokens_with_prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_tips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_tips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_tips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_tips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_tips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_tokens: {
        Row: {
          address: string
          chain_id: number
          coingecko_id: string | null
          created_at: string
          decimals: number
          fetch_price: boolean
          id: number
          image_url: string
          is_default: boolean | null
          is_native: boolean
          is_visible: boolean
          metadata: Json | null
          name: string
          pair_address: string | null
          source: string | null
          symbol: string
        }
        Insert: {
          address: string
          chain_id?: number
          coingecko_id?: string | null
          created_at?: string
          decimals: number
          fetch_price?: boolean
          id?: number
          image_url: string
          is_default?: boolean | null
          is_native: boolean
          is_visible?: boolean
          metadata?: Json | null
          name: string
          pair_address?: string | null
          source?: string | null
          symbol: string
        }
        Update: {
          address?: string
          chain_id?: number
          coingecko_id?: string | null
          created_at?: string
          decimals?: number
          fetch_price?: boolean
          id?: number
          image_url?: string
          is_default?: boolean | null
          is_native?: boolean
          is_visible?: boolean
          metadata?: Json | null
          name?: string
          pair_address?: string | null
          source?: string | null
          symbol?: string
        }
        Relationships: []
      }
      gigbot_tokens_prices: {
        Row: {
          address: string | null
          created_at: string
          price: string
          token_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          price: string
          token_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          price?: string
          token_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      gigbot_user_badges: {
        Row: {
          awarded_at: string | null
          badge_definition_id: number
          id: number
          last_verified_at: string | null
          metadata: Json | null
          user_id: number
        }
        Insert: {
          awarded_at?: string | null
          badge_definition_id: number
          id?: number
          last_verified_at?: string | null
          metadata?: Json | null
          user_id: number
        }
        Update: {
          awarded_at?: string | null
          badge_definition_id?: number
          id?: number
          last_verified_at?: string | null
          metadata?: Json | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_user_badges_badge_definition_id_fkey"
            columns: ["badge_definition_id"]
            isOneToOne: false
            referencedRelation: "gigbot_badge_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_user_gig_status: {
        Row: {
          created_at: string
          gig_id: number
          id: number
          status: Database["public"]["Enums"]["user_gig_status"]
          user_id: number
        }
        Insert: {
          created_at?: string
          gig_id: number
          id?: number
          status: Database["public"]["Enums"]["user_gig_status"]
          user_id: number
        }
        Update: {
          created_at?: string
          gig_id?: number
          id?: number
          status?: Database["public"]["Enums"]["user_gig_status"]
          user_id?: number
        }
        Relationships: []
      }
      gigbot_users: {
        Row: {
          created_at: string
          display_name: string
          farcaster_id: number | null
          farcaster_metadata: Json | null
          farcaster_username: string | null
          id: number
          is_soft_deleted: boolean | null
          is_verified_on_world_app: boolean | null
          pfp: string | null
          privy_metadata: Json
          privy_user_id: string
          reputation_score: number
          twitter_id: string | null
          twitter_metadata: Json | null
          twitter_username: string | null
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          display_name: string
          farcaster_id?: number | null
          farcaster_metadata?: Json | null
          farcaster_username?: string | null
          id?: number
          is_soft_deleted?: boolean | null
          is_verified_on_world_app?: boolean | null
          pfp?: string | null
          privy_metadata: Json
          privy_user_id: string
          reputation_score?: number
          twitter_id?: string | null
          twitter_metadata?: Json | null
          twitter_username?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          display_name?: string
          farcaster_id?: number | null
          farcaster_metadata?: Json | null
          farcaster_username?: string | null
          id?: number
          is_soft_deleted?: boolean | null
          is_verified_on_world_app?: boolean | null
          pfp?: string | null
          privy_metadata?: Json
          privy_user_id?: string
          reputation_score?: number
          twitter_id?: string | null
          twitter_metadata?: Json | null
          twitter_username?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      gigbot_users_primary_token: {
        Row: {
          created_at: string
          default_amount: string
          id: number
          token_id: number
          updated_at: string
          user_id: number
        }
        Insert: {
          created_at?: string
          default_amount: string
          id?: number
          token_id: number
          updated_at?: string
          user_id: number
        }
        Update: {
          created_at?: string
          default_amount?: string
          id?: number
          token_id?: number
          updated_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_users_primary_token_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "gigbot_tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_users_primary_token_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "gigbot_tokens_with_prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_users_primary_token_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_users_primary_token_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_users_primary_token_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_users_primary_token_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_users_primary_token_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_whitelist: {
        Row: {
          address: string
          created_at: string
          id: number
        }
        Insert: {
          address: string
          created_at?: string
          id?: number
        }
        Update: {
          address?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      image_fingerprints: {
        Row: {
          algo: string
          first_seen_at: string
          gig_id: number
          hash_hex: string
          id: number
          platform: string
          platform_user_id: string
          source_cast_hash: string
        }
        Insert: {
          algo?: string
          first_seen_at?: string
          gig_id: number
          hash_hex: string
          id?: number
          platform?: string
          platform_user_id: string
          source_cast_hash: string
        }
        Update: {
          algo?: string
          first_seen_at?: string
          gig_id?: number
          hash_hex?: string
          id?: number
          platform?: string
          platform_user_id?: string
          source_cast_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_fingerprints_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_waitlist: {
        Row: {
          app_data: string | null
          created_at: string
          email: string
          id: number
          source: string
        }
        Insert: {
          app_data?: string | null
          created_at?: string
          email: string
          id?: number
          source: string
        }
        Update: {
          app_data?: string | null
          created_at?: string
          email?: string
          id?: number
          source?: string
        }
        Relationships: []
      }
      n8n_users: {
        Row: {
          created_at: string
          fid: number
          pfp_url: string | null
          signer_uuid: string
          username: string
        }
        Insert: {
          created_at?: string
          fid?: number
          pfp_url?: string | null
          signer_uuid: string
          username: string
        }
        Update: {
          created_at?: string
          fid?: number
          pfp_url?: string | null
          signer_uuid?: string
          username?: string
        }
        Relationships: []
      }
      subscription_gig_provisioning: {
        Row: {
          cast_hash: string
          cast_url: string
          created_at: string
          duration: string
          error: string | null
          gig_id: number | null
          id: number
          occurrence_index: number
          platform: string
          scheduled_start: string
          sponsor_username: string
          status: string
          subscription_ref: string
          updated_at: string
          user_id: number
        }
        Insert: {
          cast_hash: string
          cast_url: string
          created_at?: string
          duration?: string
          error?: string | null
          gig_id?: number | null
          id?: number
          occurrence_index: number
          platform?: string
          scheduled_start: string
          sponsor_username: string
          status?: string
          subscription_ref: string
          updated_at?: string
          user_id: number
        }
        Update: {
          cast_hash?: string
          cast_url?: string
          created_at?: string
          duration?: string
          error?: string | null
          gig_id?: number | null
          id?: number
          occurrence_index?: number
          platform?: string
          scheduled_start?: string
          sponsor_username?: string
          status?: string
          subscription_ref?: string
          updated_at?: string
          user_id?: number
        }
        Relationships: []
      }
      tip_allocations_recipients: {
        Row: {
          api_url: string | null
          created_at: string
          disabled: boolean
          display_name: string | null
          id: number
          name: string | null
          recipient: Json | null
        }
        Insert: {
          api_url?: string | null
          created_at?: string
          disabled?: boolean
          display_name?: string | null
          id?: number
          name?: string | null
          recipient?: Json | null
        }
        Update: {
          api_url?: string | null
          created_at?: string
          disabled?: boolean
          display_name?: string | null
          id?: number
          name?: string | null
          recipient?: Json | null
        }
        Relationships: []
      }
      tip_shots_boosts: {
        Row: {
          asset: string
          btn_label: string | null
          chain_id: string
          contract_address: string
          cost: number
          created_at: string
          id: number
          img_src: string | null
          label: string | null
          title: string
          treasury_address: string
          type: Database["public"]["Enums"]["tipshot_paid_action_type"]
        }
        Insert: {
          asset?: string
          btn_label?: string | null
          chain_id: string
          contract_address: string
          cost: number
          created_at?: string
          id?: number
          img_src?: string | null
          label?: string | null
          title: string
          treasury_address: string
          type: Database["public"]["Enums"]["tipshot_paid_action_type"]
        }
        Update: {
          asset?: string
          btn_label?: string | null
          chain_id?: string
          contract_address?: string
          cost?: number
          created_at?: string
          id?: number
          img_src?: string | null
          label?: string | null
          title?: string
          treasury_address?: string
          type?: Database["public"]["Enums"]["tipshot_paid_action_type"]
        }
        Relationships: []
      }
      tip_shots_daily_plays: {
        Row: {
          asset: string | null
          created_at: string
          fid: number
          game_type: Database["public"]["Enums"]["tipshot_game_type"] | null
          id: number
          player_id: number | null
          round_recipients: Json | null
          score: number
        }
        Insert: {
          asset?: string | null
          created_at?: string
          fid: number
          game_type?: Database["public"]["Enums"]["tipshot_game_type"] | null
          id?: number
          player_id?: number | null
          round_recipients?: Json | null
          score?: number
        }
        Update: {
          asset?: string | null
          created_at?: string
          fid?: number
          game_type?: Database["public"]["Enums"]["tipshot_game_type"] | null
          id?: number
          player_id?: number | null
          round_recipients?: Json | null
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "tip_shots_daily_plays_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tip_shots_player_leaderboard"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "tip_shots_daily_plays_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tip_shots_players"
            referencedColumns: ["id"]
          },
        ]
      }
      tip_shots_earnings: {
        Row: {
          asset: string
          created_at: string
          game_type: Database["public"]["Enums"]["tipshot_game_type"]
          id: number
          player_id: number | null
          status: Database["public"]["Enums"]["transaction_status"]
          tx_hash: string | null
          value: number
        }
        Insert: {
          asset?: string
          created_at?: string
          game_type?: Database["public"]["Enums"]["tipshot_game_type"]
          id?: number
          player_id?: number | null
          status?: Database["public"]["Enums"]["transaction_status"]
          tx_hash?: string | null
          value?: number
        }
        Update: {
          asset?: string
          created_at?: string
          game_type?: Database["public"]["Enums"]["tipshot_game_type"]
          id?: number
          player_id?: number | null
          status?: Database["public"]["Enums"]["transaction_status"]
          tx_hash?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "tip_shots_earnings_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tip_shots_player_leaderboard"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "tip_shots_earnings_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tip_shots_players"
            referencedColumns: ["id"]
          },
        ]
      }
      tip_shots_player_boosts: {
        Row: {
          boost_id: number
          created_at: string
          id: number
          is_valid: boolean
          player_id: number
          tx_hash: string | null
          wallet_address: string
        }
        Insert: {
          boost_id: number
          created_at?: string
          id?: number
          is_valid: boolean
          player_id: number
          tx_hash?: string | null
          wallet_address: string
        }
        Update: {
          boost_id?: number
          created_at?: string
          id?: number
          is_valid?: boolean
          player_id?: number
          tx_hash?: string | null
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "tip_shots_player_actions_action_id_fkey"
            columns: ["boost_id"]
            isOneToOne: false
            referencedRelation: "tip_shots_boosts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tip_shots_player_actions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tip_shots_player_leaderboard"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "tip_shots_player_actions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tip_shots_players"
            referencedColumns: ["id"]
          },
        ]
      }
      tip_shots_players: {
        Row: {
          aptos_address: string | null
          auth_type: Database["public"]["Enums"]["tipshot_auth_type"]
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          evm_address: string | null
          fid: number
          id: number
          username: string | null
        }
        Insert: {
          aptos_address?: string | null
          auth_type?: Database["public"]["Enums"]["tipshot_auth_type"]
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          evm_address?: string | null
          fid: number
          id?: number
          username?: string | null
        }
        Update: {
          aptos_address?: string | null
          auth_type?: Database["public"]["Enums"]["tipshot_auth_type"]
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          evm_address?: string | null
          fid?: number
          id?: number
          username?: string | null
        }
        Relationships: []
      }
      tip_shots_tips: {
        Row: {
          asset: string
          created_at: string
          game_type: Database["public"]["Enums"]["tipshot_game_type"] | null
          id: number
          initiator_fid: number
          player_id: number | null
          recipient_address: string
          recipient_fid: number
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_hash: string | null
          value: number
        }
        Insert: {
          asset?: string
          created_at?: string
          game_type?: Database["public"]["Enums"]["tipshot_game_type"] | null
          id?: number
          initiator_fid: number
          player_id?: number | null
          recipient_address: string
          recipient_fid: number
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_hash?: string | null
          value: number
        }
        Update: {
          asset?: string
          created_at?: string
          game_type?: Database["public"]["Enums"]["tipshot_game_type"] | null
          id?: number
          initiator_fid?: number
          player_id?: number | null
          recipient_address?: string
          recipient_fid?: number
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_hash?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "tip_shots_tips_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tip_shots_player_leaderboard"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "tip_shots_tips_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tip_shots_players"
            referencedColumns: ["id"]
          },
        ]
      }
      token_toss_activity: {
        Row: {
          created_at: string
          formatted_value: string
          inserted_at: string
          receiver_id: number
          receiver_pfp_url: string
          receiver_username: string
          sender_id: number
          sender_pfp_url: string
          sender_username: string
          tip_id: number
        }
        Insert: {
          created_at: string
          formatted_value: string
          inserted_at?: string
          receiver_id: number
          receiver_pfp_url: string
          receiver_username: string
          sender_id: number
          sender_pfp_url: string
          sender_username: string
          tip_id: number
        }
        Update: {
          created_at?: string
          formatted_value?: string
          inserted_at?: string
          receiver_id?: number
          receiver_pfp_url?: string
          receiver_username?: string
          sender_id?: number
          sender_pfp_url?: string
          sender_username?: string
          tip_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "token_toss_activity_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "token_toss_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_toss_activity_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "token_toss_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_toss_activity_tip_id_fkey"
            columns: ["tip_id"]
            isOneToOne: true
            referencedRelation: "token_toss_tips"
            referencedColumns: ["id"]
          },
        ]
      }
      token_toss_events: {
        Row: {
          created_at: string
          id: number
          name: string
          room_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          room_id: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          room_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "token_toss_events_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "token_toss_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      token_toss_participants: {
        Row: {
          created_at: string
          event_id: number
          id: number
          joined_at: string | null
          last_seen_at: string
          left_at: string | null
          status: Database["public"]["Enums"]["token_toss_participant_status"]
          type: Database["public"]["Enums"]["token_toss_participant_type"]
          user_id: number
        }
        Insert: {
          created_at?: string
          event_id: number
          id?: number
          joined_at?: string | null
          last_seen_at?: string
          left_at?: string | null
          status?: Database["public"]["Enums"]["token_toss_participant_status"]
          type: Database["public"]["Enums"]["token_toss_participant_type"]
          user_id: number
        }
        Update: {
          created_at?: string
          event_id?: number
          id?: number
          joined_at?: string | null
          last_seen_at?: string
          left_at?: string | null
          status?: Database["public"]["Enums"]["token_toss_participant_status"]
          type?: Database["public"]["Enums"]["token_toss_participant_type"]
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "token_toss_participants_room_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "token_toss_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_toss_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "token_toss_users"
            referencedColumns: ["id"]
          },
        ]
      }
      token_toss_receiver_payments: {
        Row: {
          amount: string
          created_at: string
          event_id: number
          id: number
          sender_address: string
          transaction_hash: string
          user_id: number
          verified_at: string
        }
        Insert: {
          amount: string
          created_at?: string
          event_id: number
          id?: number
          sender_address: string
          transaction_hash: string
          user_id: number
          verified_at?: string
        }
        Update: {
          amount?: string
          created_at?: string
          event_id?: number
          id?: number
          sender_address?: string
          transaction_hash?: string
          user_id?: number
          verified_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_event"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "token_toss_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "token_toss_users"
            referencedColumns: ["id"]
          },
        ]
      }
      token_toss_rooms: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      token_toss_tips: {
        Row: {
          bundle_id: string | null
          created_at: string
          event_id: number
          formatted_value: string
          id: number
          receiver_id: number
          sender_id: number
          status: Database["public"]["Enums"]["tx_status"]
          token_id: number | null
          value: string
        }
        Insert: {
          bundle_id?: string | null
          created_at?: string
          event_id: number
          formatted_value: string
          id?: number
          receiver_id: number
          sender_id: number
          status?: Database["public"]["Enums"]["tx_status"]
          token_id?: number | null
          value: string
        }
        Update: {
          bundle_id?: string | null
          created_at?: string
          event_id?: number
          formatted_value?: string
          id?: number
          receiver_id?: number
          sender_id?: number
          status?: Database["public"]["Enums"]["tx_status"]
          token_id?: number | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_toss_tips_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "token_toss_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_toss_tips_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "token_toss_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_toss_tips_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "token_toss_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_toss_tips_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "token_toss_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      token_toss_tokens: {
        Row: {
          address: string
          coingecko_id: string | null
          created_at: string
          decimals: number
          id: number
          image_url: string
          is_native: boolean
          network: string
          symbol: string
        }
        Insert: {
          address: string
          coingecko_id?: string | null
          created_at?: string
          decimals: number
          id?: number
          image_url: string
          is_native?: boolean
          network?: string
          symbol: string
        }
        Update: {
          address?: string
          coingecko_id?: string | null
          created_at?: string
          decimals?: number
          id?: number
          image_url?: string
          is_native?: boolean
          network?: string
          symbol?: string
        }
        Relationships: []
      }
      token_toss_users: {
        Row: {
          created_at: string
          farcaster_id: number | null
          farcaster_metadata: Json | null
          farcaster_username: string | null
          id: number
          pfp_url: string
          privy_metadata: Json | null
          privy_user_id: string
          username: string
          x_id: string | null
          x_metadata: Json | null
          x_username: string | null
        }
        Insert: {
          created_at?: string
          farcaster_id?: number | null
          farcaster_metadata?: Json | null
          farcaster_username?: string | null
          id?: number
          pfp_url: string
          privy_metadata?: Json | null
          privy_user_id: string
          username: string
          x_id?: string | null
          x_metadata?: Json | null
          x_username?: string | null
        }
        Update: {
          created_at?: string
          farcaster_id?: number | null
          farcaster_metadata?: Json | null
          farcaster_username?: string | null
          id?: number
          pfp_url?: string
          privy_metadata?: Json | null
          privy_user_id?: string
          username?: string
          x_id?: string | null
          x_metadata?: Json | null
          x_username?: string | null
        }
        Relationships: []
      }
      token_toss_wallets: {
        Row: {
          address: string
          created_at: string
          event_id: number
          id: number
          privy_id: string
          tx_hash: string | null
        }
        Insert: {
          address: string
          created_at?: string
          event_id: number
          id?: number
          privy_id: string
          tx_hash?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          event_id?: number
          id?: number
          privy_id?: string
          tx_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "token_toss_wallets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "token_toss_events"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          fid: number
          fname: string
          id: number
          onboarding_status: string | null
          points: number
          question1: string[] | null
          question2: string[] | null
          question3: string[] | null
          signer_uuid: string | null
          user_address: string | null
        }
        Insert: {
          created_at?: string
          fid: number
          fname?: string
          id?: number
          onboarding_status?: string | null
          points?: number
          question1?: string[] | null
          question2?: string[] | null
          question3?: string[] | null
          signer_uuid?: string | null
          user_address?: string | null
        }
        Update: {
          created_at?: string
          fid?: number
          fname?: string
          id?: number
          onboarding_status?: string | null
          points?: number
          question1?: string[] | null
          question2?: string[] | null
          question3?: string[] | null
          signer_uuid?: string | null
          user_address?: string | null
        }
        Relationships: []
      }
      vibevine_app_product_summaries: {
        Row: {
          app_url: string
          created_at: string
          customer_profile: string | null
          description: string | null
          id: number
          keywords: string[]
          problem_solved: string | null
          solution: string | null
          subreddits: string[]
          title: string | null
          updated_at: string
        }
        Insert: {
          app_url: string
          created_at?: string
          customer_profile?: string | null
          description?: string | null
          id?: number
          keywords?: string[]
          problem_solved?: string | null
          solution?: string | null
          subreddits?: string[]
          title?: string | null
          updated_at?: string
        }
        Update: {
          app_url?: string
          created_at?: string
          customer_profile?: string | null
          description?: string | null
          id?: number
          keywords?: string[]
          problem_solved?: string | null
          solution?: string | null
          subreddits?: string[]
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      automation_user_activities: {
        Row: {
          actionDisplayWording: string | null
          actionId: string | null
          actionType: string | null
          amount: number | null
          asset: string | null
          contentUrl: string | null
          created_at: string | null
          dstChainId: number | null
          farcaster_id: number | null
          id: number | null
          points: number | null
          reactionHash: string | null
          recipientAddress: string | null
          recipientAvatarUrl: string | null
          recipientDisplayName: string | null
          recipientFid: number | null
          recipientName: string | null
          senderAvatarUrl: string | null
          senderDisplayName: string | null
          senderFid: number | null
          senderName: string | null
          srcChainId: number | null
          txHash: string | null
          txStatus: Database["public"]["Enums"]["tx_status"] | null
          user_id: number | null
          warpcast_url: string | null
          x_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_active_farcaster_users: {
        Row: {
          active_days: number | null
          avg_tips_per_day: number | null
          display_name: string | null
          farcaster_id: number | null
          farcaster_username: string | null
          first_activity: string | null
          latest_activity: string | null
          pfp: string | null
          tips_count: number | null
          twitter_id: string | null
          twitter_username: string | null
          user_id: number | null
          username: string | null
        }
        Relationships: []
      }
      gigbot_completed_tasks_with_badges: {
        Row: {
          badges: Json | null
          bot_reply_cast_hash: string | null
          completed_at: number | null
          created_at: string | null
          display_name: string | null
          gig_id: number | null
          gig_type: string | null
          id: number | null
          metadata: Json | null
          pfp_url: string | null
          platform: Database["public"]["Enums"]["tip_game_platform"] | null
          platform_user_id: string | null
          processed_at: number | null
          tip_id: number | null
          user_id: number | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_completed_tasks_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_completed_tasks_gig_type_fkey"
            columns: ["gig_type"]
            isOneToOne: false
            referencedRelation: "gigbot_gig_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_completed_tasks_tip_id_fkey"
            columns: ["tip_id"]
            isOneToOne: false
            referencedRelation: "gigbot_tips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_completed_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_completed_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_completed_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_completed_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_completed_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_daily_earners: {
        Row: {
          display_name: string | null
          earned_date: string | null
          platform: Database["public"]["Enums"]["tip_game_platform"] | null
          platform_user_id: string | null
          username: string | null
        }
        Relationships: []
      }
      gigbot_embedded_addresses: {
        Row: {
          id: number | null
          wallet_address: string | null
        }
        Relationships: []
      }
      gigbot_gigs_leaderboard: {
        Row: {
          badges: Json | null
          chain_details: Json | null
          display_name: string | null
          farcaster_id: number | null
          farcaster_username: string | null
          first_gig_date: string | null
          gig_ids: number[] | null
          latest_gig_date: string | null
          leaderboard_rank: number | null
          pfp: string | null
          token_details: Json | null
          total_gigs: number | null
          total_usd_amount: number | null
          twitter_id: string | null
          twitter_username: string | null
          unique_chains: number | null
          unique_gig_types: number | null
          unique_tokens: number | null
          user_id: number | null
          username: string | null
        }
        Relationships: []
      }
      gigbot_leaderboard_with_badges: {
        Row: {
          badges: Json | null
          claimed_tokens: Json | null
          completed_tasks: number | null
          created_at: string | null
          farcaster_username: string | null
          id: number | null
          pending_claims: number | null
          success_claims: number | null
          total_usd_amount: number | null
          twitter_username: string | null
          user_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gigbot_leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "gigbot_active_farcaster_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "gigbot_embedded_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "gigbot_gigs_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gigbot_leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "gigbot_user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigbot_leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "gigbot_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gigbot_tokens_with_prices: {
        Row: {
          address: string | null
          chain_id: number | null
          coingecko_id: string | null
          created_at: string | null
          decimals: number | null
          fetch_price: boolean | null
          id: number | null
          image_url: string | null
          is_default: boolean | null
          is_native: boolean | null
          is_visible: boolean | null
          name: string | null
          pair_address: string | null
          price: string | null
          source: string | null
          symbol: string | null
        }
        Relationships: []
      }
      gigbot_user_addresses: {
        Row: {
          id: number | null
          wallet_address: string | null
          wallet_source: string | null
        }
        Relationships: []
      }
      tip_shots_player_leaderboard: {
        Row: {
          auth_type: Database["public"]["Enums"]["tipshot_auth_type"] | null
          avatar_url: string | null
          fid: number | null
          game_type: Database["public"]["Enums"]["tipshot_game_type"] | null
          player_id: number | null
          top_score: number | null
          total_plays: number | null
          username: string | null
        }
        Relationships: []
      }
      tip_shots_top_10_recent_players: {
        Row: {
          asset: string | null
          created_at: string | null
          fid: number | null
          id: number | null
          round_recipients: Json | null
          score: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calc_dist_from_actions: {
        Args: {
          p_daily_points: number
          p_daily_tokens: number
          p_day: string
          p_fid: number
        }
        Returns: {
          recipientaddress: string
          tokenamount: number
        }[]
      }
      calc_new_user_leaderboard: {
        Args: { p_end_day: string; p_start_day: string }
        Returns: {
          points: number
          usdcamount: number
          useravatarurl: string
          userdisplayname: string
          userfid: number
          username: string
          userUrl: string
        }[]
      }
      calc_patron_leaderboard: {
        Args: { p_end_day: string; p_start_day: string }
        Returns: {
          points: number
          usdcamount: number
          useravatarurl: string
          userdisplayname: string
          userfid: number
          username: string
          userUrl: string
        }[]
      }
      calc_recipient_leaderboard: {
        Args: { p_end_day: string; p_start_day: string }
        Returns: {
          points: number
          usdcamount: number
          useravatarurl: string
          userdisplayname: string
          userfid: number
          username: string
          userUrl: string
        }[]
      }
      clean_expired_bullpost_notifications: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_country_with_rank: {
        Args: {
          p_flag_emoji?: string
          p_name?: string
          p_order_number?: number
        }
        Returns: {
          background_image: string
          code: string
          country_rank: number
          flag_emoji: string
          id: number
          name: string
          order_number: number
          short_name: string
          total_taps: number
        }[]
      }
      get_disabled_farcaster_recipients_for_platform: {
        Args: { input_gig_type: string; input_platform: string }
        Returns: {
          fid: number
          token: string
          user_id: number
        }[]
      }
      get_expo_recipients_for_gig_type_and_platform: {
        Args: { gig_type: string; platform: string }
        Returns: {
          device: string
          token: string
          user_id: number
        }[]
      }
      get_farcaster_disabled_recipients_for_gig_type: {
        Args: { gig_type: string }
        Returns: {
          enabled: boolean
          farcaster_username: string
          fid: number
          has_setting: boolean
          token: string
          user_id: number
          username: string
        }[]
      }
      get_farcaster_opted_out_recipients_for_gig_type: {
        Args: { input_gig_type: string }
        Returns: {
          fid: number
          token: string
          user_id: number
        }[]
      }
      get_farcaster_recipients_for_gig_type_and_platform: {
        Args: { input_gig_type: string; input_platform: string }
        Returns: {
          fid: number
          token: string
          user_id: number
        }[]
      }
      get_farcaster_users_with_disabled_notifications: {
        Args: { gig_type: string }
        Returns: {
          fid: number
          token: string
          user_id: number
        }[]
      }
      get_frames_and_tags_by_tag_names_with_search: {
        Args: { search_query: string; tag_names: string[] }
        Returns: {
          author_fid: number
          author_username: string
          cast_data: Json
          cast_hash: string
          cast_text: string
          created_at: string
          description: string
          frame_created_at: string
          frame_image: string
          frame_url: string
          id: number
          rating: number
          status: string
          subtitle: string
          tags: Json[]
          title: string
          warpcast_link: string
        }[]
      }
      get_frames_by_tag_ids_with_details: {
        Args: { tag_ids: number[] }
        Returns: {
          author_fid: number
          author_username: string
          cast_data: Json
          cast_hash: string
          cast_text: string
          created_at: string
          frame_created_at: string
          frame_image: string
          frame_url: string
          id: number
          status: string
          warpcast_link: string
        }[]
      }
      get_frames_by_tag_names_with_details: {
        Args: { tag_names: string[] }
        Returns: {
          author_fid: number
          author_username: string
          cast_data: Json
          cast_hash: string
          cast_text: string
          created_at: string
          frame_created_at: string
          frame_image: string
          frame_url: string
          id: number
          status: string
          warpcast_link: string
        }[]
      }
      get_frames_with_tags_by_tag_names: {
        Args: { tag_names: string[] }
        Returns: {
          author_fid: number
          author_username: string
          cast_data: Json
          cast_hash: string
          cast_text: string
          created_at: string
          frame_created_at: string
          frame_image: string
          frame_url: string
          id: number
          status: string
          tags: Json[]
          warpcast_link: string
        }[]
      }
      get_latest_fartokens_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          lf_asset_id: string
          lf_fetch_timestamp: string
          lf_liquidity: number
          lf_market_cap: number
          lf_price: number
          lf_price_change: Json
          nf_channel_link: string
          nf_description: string
          nf_how_to_earn: string
          nf_img_url: string
          nf_name: string
          nf_pair_address: string
          nf_published: boolean
          nf_ticker: string
          nf_website_url: string
        }[]
      }
      get_latest_fartokens_datav2: {
        Args: Record<PropertyKey, never>
        Returns: {
          lf_asset_id: string
          lf_fetch_timestamp: string
          lf_liquidity: number
          lf_market_cap: number
          lf_price: number
          lf_price_change: Json
          nf_channel_link: string
          nf_description: string
          nf_how_to_earn: string
          nf_img_url: string
          nf_name: string
          nf_pair_address: string
          nf_published: boolean
          nf_ticker: string
          nf_website_url: string
          t_total_casts: number
          t_total_tips_sum: number
          t_total_unique_fids: number
        }[]
      }
      get_latest_tapped_country_with_rank: {
        Args: { p_fid: number }
        Returns: {
          background_image: string
          code: string
          country_rank: number
          flag_emoji: string
          id: number
          name: string
          order_number: number
          short_name: string
          total_taps: number
        }[]
      }
      get_market_cap_summary: {
        Args: { interval_type: string; start_date: string }
        Returns: {
          date: string
          marketcap: number
        }[]
      }
      get_tags_for_frame: {
        Args: { id: number }
        Returns: {
          color: string
          tag_id: number
          tag_name: string
        }[]
      }
      get_token_historical_data: {
        Args: { p_asset_id: string; p_interval: string; p_start_date: string }
        Returns: {
          avg_liquidity: number
          avg_market_cap: number
          avg_price: number
          time_bucket: string
        }[]
      }
      get_top_earners_24h: {
        Args: Record<PropertyKey, never>
        Returns: {
          display_username: string
          pfp_url: string
          token_amount: number
          token_id: number
          token_symbol: string
          usd_amount_24h: number
          user_id: number
        }[]
      }
      get_total_market_cap: {
        Args: { interval_type: string }
        Returns: {
          date: string
          marketcap: number
        }[]
      }
      get_transactions_grouped_by_date: {
        Args: { _fid: number }
        Returns: {
          transaction_date: string
          transactions_data: Json
        }[]
      }
      get_tweet_boosts_with_counts: {
        Args: { boosters_limit?: number; tweet_ids: string[] }
        Returns: {
          boost_count: number
          recent_boosters: Json
          tweet_id: string
        }[]
      }
      get_unique_frames_by_tag_ids: {
        Args: { tag_ids: number[] }
        Returns: {
          frame_id: number
        }[]
      }
      get_unique_frames_by_tag_names: {
        Args: { tag_names: string[] }
        Returns: {
          frame_id: number
        }[]
      }
      get_users_with_disabled_notifications: {
        Args: { gig_type: string }
        Returns: {
          fid: number
          token: string
          user_id: number
        }[]
      }
      get_users_with_disabled_notifications_debug: {
        Args: { gig_type: string }
        Returns: {
          actual_gig_type: string
          enabled: boolean
          user_id: number
        }[]
      }
      get_winners_with_user_info: {
        Args:
          | Record<PropertyKey, never>
          | { end_time: string; start_time: string }
        Returns: {
          created_at: string
          display_name: string
          fid: number
          game: string
          payout_amount: string
          payout_currency: string
          pfp_url: string
          rank: number
          user_address: string
          username: string
          winner_id: number
        }[]
      }
      gigbot_get_aggregated_tips: {
        Args: {
          p_platform?: Database["public"]["Enums"]["social_platform"]
          p_search?: string
          p_sort_order?: string
        }
        Returns: {
          claimed_rewards: number
          claimed_tokens: Json
          display_username: string
          farcaster_username: string
          has_farcaster: boolean
          has_x: boolean
          pending_rewards: number
          pending_tokens: Json
          pfp_url: string
          token_metadata: Json
          total_tasks: number
          total_usd_value: string
          twitter_username: string
          username: string
        }[]
      }
      gigbot_get_daily_aggregated_tips: {
        Args: {
          p_hours_ago?: number
          p_platform?: Database["public"]["Enums"]["social_platform"]
          p_search?: string
          p_sort_order?: string
        }
        Returns: {
          claimed_rewards: number
          claimed_tokens: Json
          farcaster_username: string
          has_farcaster: boolean
          has_x: boolean
          pending_rewards: number
          pending_tokens: Json
          pfp_url: string
          token_metadata: Json
          total_tasks: number
          total_usd_value: string
          twitter_username: string
          username: string
        }[]
      }
      gigbot_get_leaderboard_cached: {
        Args: { p_username?: string }
        Returns: {
          claimed_rewards: number
          claimed_tokens: Json
          display_username: string
          farcaster_username: string
          has_farcaster: boolean
          has_x: boolean
          pending_rewards: number
          pending_tokens: Json
          pfp_url: string
          token_metadata: Json
          total_tasks: number
          total_usd_value: string
          twitter_username: string
          username: string
        }[]
      }
      migrate_existing_players: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      migrate_notification_settings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      new_get_frames_and_tags_by_tag_names: {
        Args: { tag_names: string[] }
        Returns: {
          author_fid: number
          author_username: string
          cast_data: Json
          cast_hash: string
          cast_text: string
          created_at: string
          description: string
          frame_created_at: string
          frame_image: string
          frame_url: string
          id: number
          rating: number
          status: string
          subtitle: string
          tags: Json[]
          title: string
          warpcast_link: string
        }[]
      }
      olympics_country_info: {
        Args: { p_flag_emoji?: string; p_order_number?: number }
        Returns: {
          country_rank: number
          flag_emoji: string
          id: number
          name: string
          order_number: number
        }[]
      }
      refresh_gigbot_leaderboard_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      request_wrapper: {
        Args: {
          body?: Json
          headers?: Json
          method: string
          params?: Json
          url: string
        }
        Returns: number
      }
      search_frames_by_keyword: {
        Args: { search_query: string }
        Returns: {
          author_fid: number
          author_username: string
          cast_data: Json
          cast_hash: string
          cast_text: string
          created_at: string
          description: string
          frame_created_at: string
          frame_image: string
          frame_url: string
          id: number
          rating: number
          status: string
          subtitle: string
          title: string
          warpcast_link: string
        }[]
      }
      search_frames_by_title: {
        Args: { search_query: string }
        Returns: {
          author_fid: number
          author_username: string
          cast_data: Json
          cast_hash: string
          cast_text: string
          created_at: string
          description: string
          frame_created_at: string
          frame_image: string
          frame_url: string
          id: number
          rating: number
          status: string
          subtitle: string
          title: string
          warpcast_link: string
        }[]
      }
      search_leaderboard_with_global_rank: {
        Args: { search_term: string }
        Returns: {
          badges: Json
          claimed_tokens: Json
          completed_tasks: number
          created_at: string
          farcaster_username: string
          global_rank: number
          id: number
          pending_claims: number
          success_claims: number
          total_usd_amount: number
          twitter_username: string
          user_id: number
        }[]
      }
      select_max_streaks_today: {
        Args: { channel_param: string }
        Returns: {
          fid: number
          streak_count: number
        }[]
      }
      select_next_highest_streak: {
        Args: { channel_param: string; current_highest_count_param: number }
        Returns: {
          fid: number
          streak_count: number
        }[]
      }
      select_unique_degen_wallets: {
        Args: Record<PropertyKey, never>
        Returns: {
          account_address: string
          fid: number
          fname: string
        }[]
      }
      token_toss_get_tips_leaderboard: {
        Args:
          | Record<PropertyKey, never>
          | { page_limit?: number; page_offset?: number }
        Returns: {
          pfp_url: string
          tip_count: number
          user_id: number
          username: string
        }[]
      }
    }
    Enums: {
      allocation_status: "pending" | "distributed"
      api_key_status: "active" | "inactive" | "revoked"
      bullpost_notification_status: "unread" | "read" | "archived"
      bullpost_notification_type:
        | "boost_reward"
        | "general_announcement"
        | "new_general"
        | "general_tweet"
        | "soldier_milestone"
        | "boost_milestone"
      enum: "id"
      gig_status: "created" | "processing" | "funded"
      gigbot_badge_type:
        | "erc20_balance"
        | "lp_provider"
        | "whale_rank"
        | "open_rank_percentile"
      market_type: "FUNDED" | "RESOLVED" | "LOCKED"
      olympics_tap: "normal" | "super" | "slashed"
      rate_window: "minute" | "hour" | "day"
      reaction_type: "likes" | "recasts"
      social_platform:
        | "farcaster"
        | "x"
        | "onchain"
        | "tiktok"
        | "instagram"
        | "youtube"
      stripe_subscription_status:
        | "active"
        | "incomplete"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "incomplete_expired"
        | "trialing"
        | "paused"
      subscription_tier:
        | "free"
        | "basic"
        | "professional"
        | "enterprise"
        | "custom"
      task_status: "pending" | "processing" | "completed"
      tip_game_action_type: "mention" | "recast" | "like" | "reply" | "quote"
      tip_game_platform:
        | "x"
        | "farcaster"
        | "onchain"
        | "youtube"
        | "instagram"
        | "tiktok"
      tipshot_auth_type: "privy" | "warpcast"
      tipshot_game_type: "moxie" | "degen" | "aptos"
      tipshot_paid_action_type: "buy_lives" | "buy_shots"
      token_toss_participant_status:
        | "active"
        | "left"
        | "kicked"
        | "disconnected"
      token_toss_participant_type: "sender" | "receiver"
      transaction_status: "pending" | "processed"
      tx_status: "pending" | "success" | "failed" | "processing" | "expired"
      user_gig_status: "visited" | "in_progress" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      allocation_status: ["pending", "distributed"],
      api_key_status: ["active", "inactive", "revoked"],
      bullpost_notification_status: ["unread", "read", "archived"],
      bullpost_notification_type: [
        "boost_reward",
        "general_announcement",
        "new_general",
        "general_tweet",
        "soldier_milestone",
        "boost_milestone",
      ],
      enum: ["id"],
      gig_status: ["created", "processing", "funded"],
      gigbot_badge_type: [
        "erc20_balance",
        "lp_provider",
        "whale_rank",
        "open_rank_percentile",
      ],
      market_type: ["FUNDED", "RESOLVED", "LOCKED"],
      olympics_tap: ["normal", "super", "slashed"],
      rate_window: ["minute", "hour", "day"],
      reaction_type: ["likes", "recasts"],
      social_platform: [
        "farcaster",
        "x",
        "onchain",
        "tiktok",
        "instagram",
        "youtube",
      ],
      stripe_subscription_status: [
        "active",
        "incomplete",
        "past_due",
        "canceled",
        "unpaid",
        "incomplete_expired",
        "trialing",
        "paused",
      ],
      subscription_tier: [
        "free",
        "basic",
        "professional",
        "enterprise",
        "custom",
      ],
      task_status: ["pending", "processing", "completed"],
      tip_game_action_type: ["mention", "recast", "like", "reply", "quote"],
      tip_game_platform: [
        "x",
        "farcaster",
        "onchain",
        "youtube",
        "instagram",
        "tiktok",
      ],
      tipshot_auth_type: ["privy", "warpcast"],
      tipshot_game_type: ["moxie", "degen", "aptos"],
      tipshot_paid_action_type: ["buy_lives", "buy_shots"],
      token_toss_participant_status: [
        "active",
        "left",
        "kicked",
        "disconnected",
      ],
      token_toss_participant_type: ["sender", "receiver"],
      transaction_status: ["pending", "processed"],
      tx_status: ["pending", "success", "failed", "processing", "expired"],
      user_gig_status: ["visited", "in_progress", "completed"],
    },
  },
} as const
