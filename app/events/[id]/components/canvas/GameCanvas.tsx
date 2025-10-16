'use client';
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  GAME_CONFIG,
  PUCK_TYPES,
  AVATAR_EMOJIS,
} from '@/lib/constants/gameConfig';
import type { PuckType } from '@/lib/constants/gameConfig';
import {
  checkCircleCollision,
  applyFriction,
  clampMagnitude,
  magnitude,
  isStationary,
} from '@/lib/utils/physics';
import type {
  PhysicsBody,
  Vector2D,
} from '@/lib/utils/physics';
import { soundManager } from '@/lib/utils/sound';
import type { Participant } from '../Participants';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
}

interface TrailSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  life: number;
  maxLife: number;
  width: number;
}

interface Avatar extends PhysicsBody {
  id: number;
  hitAnimation: number;
  emoji: string;
  // Add image-related properties
  participantId?: number;
  username?: string;
  imageElement?: HTMLImageElement | null;
  imageLoaded: boolean;
  initials?: string;
}

interface Puck extends PhysicsBody {
  isAbsorbing: boolean;
  absorbProgress: number;
  absorbTarget: Vector2D | null;
  hasScored: boolean;
  lastTrailPosition: Vector2D | null;
  trailCounter: number;
  bounceCount: number;
  hitBumpers: Set<number>; // Track which bumpers have been hit
}

interface Bumper {
  id: number;
  position: Vector2D;
  radius: number;
  speedReduction: number;
}

interface BoxObstacle {
  position: Vector2D; // top-left corner
  width: number;
  height: number;
  restitution: number;
}

interface LShapeObstacle {
  position: Vector2D; // center point of the L-shape
  armWidth: number;
  armHeight: number;
  rotation: number; // 0, 90, 180, or 270 degrees
  restitution: number;
}

interface GameCanvasProps {
  selectedPuck: PuckType;
  isPowerMode: boolean;
  onShot: () => void;
  onHit: (score: number, receiver: Participant) => void;
  onMiss: () => void;
  onPowerUsed: () => void;
  isPaused: boolean;
  eventId: number;
  receivers: Participant[];
  combo?: number;
  // onCaptureReady REMOVED
}

// Define the exposed methods
export interface GameCanvasHandle {
  captureCanvas: () => Promise<void>;
}

export const GameCanvas = forwardRef<GameCanvasHandle, GameCanvasProps>(
  function GameCanvas(
    {
      selectedPuck,
      isPowerMode,
      onShot,
      onHit,
      onMiss,
      onPowerUsed,
      isPaused,
      eventId,
      receivers,
      combo = 0,
    },
    ref,
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<Vector2D | null>(null);
    const [dragCurrent, setDragCurrent] = useState<Vector2D | null>(null);

    // const { data: participants, isLoading: participantsLoading } =
    //   useActiveParticipants({
    //     eventId: eventId,
    //   });
    // const { supabaseUser } = useSupabaseUser();

    const puckRef = useRef<Puck | null>(null);
    const avatarsRef = useRef<Avatar[]>([]);
    const particlesRef = useRef<Particle[]>([]);
    const trailSegmentsRef = useRef<TrailSegment[]>([]);
    const animationFrameRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);

    // Add image cache
    const imageCache = useRef<Map<number, HTMLImageElement>>(new Map());
    
    // Obstacle refs
    const bumpersRef = useRef<Bumper[]>([]);
    const boxObstaclesRef = useRef<BoxObstacle[]>([]);
    const lShapesRef = useRef<LShapeObstacle[]>([]);
    const obstaclesInitializedRef = useRef(false);
    const lastReceiverCountRef = useRef(0);

    // Filter participants by type
    // const receivers = participants?.filter((p) => p.type === 'receiver') || [];
    // Filter out current user from senders since we show them separately via ProfileAvatar
    // const senders =
    //   participants?.filter(
    //     (p) => p.type === 'sender' && p.user_id !== supabaseUser?.id,
    //   ) || [];
    // console.log('participants', participants);
    // Helper function to generate initials
    const getInitials = useCallback((username: string): string => {
      return (
        username
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || username.slice(0, 2).toUpperCase()
      );
    }, []);

    // Generate random obstacles
    const generateObstacles = useCallback(() => {
      const bumpers: Bumper[] = [];
      const boxObstacles: BoxObstacle[] = [];
      const lShapes: LShapeObstacle[] = [];
      let bumperId = 0;
      
      const totalObstacles = Math.floor(
        Math.random() * (GAME_CONFIG.OBSTACLE_MAX_COUNT - GAME_CONFIG.OBSTACLE_MIN_COUNT + 1)
      ) + GAME_CONFIG.OBSTACLE_MIN_COUNT;
      
      // Helper to check if a position is too close to avatars
      const isTooCloseToAvatars = (x: number, y: number, radius: number): boolean => {
        return avatarsRef.current.some(avatar => {
          const dx = avatar.position.x - x;
          const dy = avatar.position.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < (GAME_CONFIG.AVATAR_SAFE_ZONE + radius);
        });
      };
      
      // Helper to check if a position overlaps with existing obstacles
      const overlapsExisting = (x: number, y: number, radius: number): boolean => {
        // Check bumpers
        for (const bumper of bumpers) {
          const dx = bumper.position.x - x;
          const dy = bumper.position.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < (bumper.radius + radius + GAME_CONFIG.OBSTACLE_SPAWN_MARGIN)) {
            return true;
          }
        }
        
        // Check box obstacles (treat as circle with radius = diagonal/2)
        for (const box of boxObstacles) {
          const boxCenterX = box.position.x + box.width / 2;
          const boxCenterY = box.position.y + box.height / 2;
          const boxRadius = Math.sqrt(box.width * box.width + box.height * box.height) / 2;
          const dx = boxCenterX - x;
          const dy = boxCenterY - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < (boxRadius + radius + GAME_CONFIG.OBSTACLE_SPAWN_MARGIN)) {
            return true;
          }
        }
        
        // Check L-shapes (treat as circle with radius = diagonal/2 of bounding box)
        for (const lShape of lShapes) {
          const lShapeRadius = Math.sqrt(
            lShape.armWidth * lShape.armWidth + lShape.armWidth * lShape.armWidth
          ) / 2;
          const dx = lShape.position.x - x;
          const dy = lShape.position.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < (lShapeRadius + radius + GAME_CONFIG.OBSTACLE_SPAWN_MARGIN)) {
            return true;
          }
        }
        
        return false;
      };
      
      // Generate obstacles
      let attempts = 0;
      const maxAttempts = 100;
      
      for (let i = 0; i < totalObstacles && attempts < maxAttempts; i++) {
        const rand = Math.random();
        const obstacleType = rand < 0.33 ? 'bumper' : rand < 0.66 ? 'box' : 'lshape';
        
        if (obstacleType === 'bumper') {
          // Generate bumper
          let x: number = 0;
          let y: number = 0;
          let validPosition = false;
          let bumperAttempts = 0;
          
          while (!validPosition && bumperAttempts < 20) {
            x = GAME_CONFIG.BUMPER_RADIUS + Math.random() * (GAME_CONFIG.CANVAS_WIDTH - GAME_CONFIG.BUMPER_RADIUS * 2);
            y = GAME_CONFIG.SPAWN_ZONE_TOP + Math.random() * (GAME_CONFIG.SPAWN_ZONE_BOTTOM - GAME_CONFIG.SPAWN_ZONE_TOP);
            
            if (!isTooCloseToAvatars(x, y, GAME_CONFIG.BUMPER_RADIUS) && 
                !overlapsExisting(x, y, GAME_CONFIG.BUMPER_RADIUS)) {
              validPosition = true;
            }
            bumperAttempts++;
          }
          
          if (validPosition) {
            bumpers.push({
              id: bumperId++,
              position: { x, y },
              radius: GAME_CONFIG.BUMPER_RADIUS,
              speedReduction: GAME_CONFIG.BUMPER_SPEED_REDUCTION,
            });
          } else {
            attempts++;
          }
        } else if (obstacleType === 'box') {
          // Generate box obstacle
          let x: number = 0;
          let y: number = 0;
          let validPosition = false;
          let boxAttempts = 0;
          
          while (!validPosition && boxAttempts < 20) {
            x = Math.random() * (GAME_CONFIG.CANVAS_WIDTH - GAME_CONFIG.BOX_WIDTH);
            y = GAME_CONFIG.SPAWN_ZONE_TOP + Math.random() * (GAME_CONFIG.SPAWN_ZONE_BOTTOM - GAME_CONFIG.SPAWN_ZONE_TOP - GAME_CONFIG.BOX_HEIGHT);
            
            const centerX = x + GAME_CONFIG.BOX_WIDTH / 2;
            const centerY = y + GAME_CONFIG.BOX_HEIGHT / 2;
            const boxRadius = Math.sqrt(GAME_CONFIG.BOX_WIDTH * GAME_CONFIG.BOX_WIDTH + GAME_CONFIG.BOX_HEIGHT * GAME_CONFIG.BOX_HEIGHT) / 2;
            
            if (!isTooCloseToAvatars(centerX, centerY, boxRadius) && 
                !overlapsExisting(centerX, centerY, boxRadius)) {
              validPosition = true;
            }
            boxAttempts++;
          }
          
          if (validPosition) {
            boxObstacles.push({
              position: { x, y },
              width: GAME_CONFIG.BOX_WIDTH,
              height: GAME_CONFIG.BOX_HEIGHT,
              restitution: GAME_CONFIG.BOX_RESTITUTION,
            });
          } else {
            attempts++;
          }
        } else {
          // Generate L-shape obstacle
          let x: number = 0;
          let y: number = 0;
          let validPosition = false;
          let lShapeAttempts = 0;
          const rotation = [0, 90, 180, 270][Math.floor(Math.random() * 4)];
          
          // Calculate bounding box size for L-shape (approximately armWidth x armWidth)
          const lShapeRadius = Math.sqrt(
            GAME_CONFIG.L_SHAPE_ARM_WIDTH * GAME_CONFIG.L_SHAPE_ARM_WIDTH + 
            GAME_CONFIG.L_SHAPE_ARM_WIDTH * GAME_CONFIG.L_SHAPE_ARM_WIDTH
          ) / 2;
          
          while (!validPosition && lShapeAttempts < 20) {
            x = lShapeRadius + Math.random() * (GAME_CONFIG.CANVAS_WIDTH - lShapeRadius * 2);
            y = GAME_CONFIG.SPAWN_ZONE_TOP + lShapeRadius + Math.random() * (GAME_CONFIG.SPAWN_ZONE_BOTTOM - GAME_CONFIG.SPAWN_ZONE_TOP - lShapeRadius * 2);
            
            if (!isTooCloseToAvatars(x, y, lShapeRadius) && 
                !overlapsExisting(x, y, lShapeRadius)) {
              validPosition = true;
            }
            lShapeAttempts++;
          }
          
          if (validPosition) {
            lShapes.push({
              position: { x, y },
              armWidth: GAME_CONFIG.L_SHAPE_ARM_WIDTH,
              armHeight: GAME_CONFIG.L_SHAPE_ARM_HEIGHT,
              rotation: rotation,
              restitution: GAME_CONFIG.L_SHAPE_RESTITUTION,
            });
          } else {
            attempts++;
          }
        }
      }
      
      return { bumpers, boxObstacles, lShapes };
    }, []);
    
    // Check bumper collision (circle to circle)
    const checkBumperCollision = useCallback((puck: Puck, bumper: Bumper): boolean => {
      const dx = puck.position.x - bumper.position.x;
      const dy = puck.position.y - bumper.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < (puck.radius + bumper.radius);
    }, []);
    
    // Check and handle box obstacle collision (circle to rectangle)
    const handleBoxCollision = useCallback((puck: Puck, box: BoxObstacle): void => {
      // Find closest point on rectangle to circle center
      const closestX = Math.max(box.position.x, Math.min(puck.position.x, box.position.x + box.width));
      const closestY = Math.max(box.position.y, Math.min(puck.position.y, box.position.y + box.height));
      
      // Calculate distance from closest point to circle center
      const dx = puck.position.x - closestX;
      const dy = puck.position.y - closestY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < puck.radius) {
        // Collision detected - determine which side was hit
        const puckLeft = puck.position.x - puck.radius;
        const puckRight = puck.position.x + puck.radius;
        const puckTop = puck.position.y - puck.radius;
        const puckBottom = puck.position.y + puck.radius;
        
        const boxLeft = box.position.x;
        const boxRight = box.position.x + box.width;
        const boxTop = box.position.y;
        const boxBottom = box.position.y + box.height;
        
        // Calculate overlap on each side
        const overlapLeft = puckRight - boxLeft;
        const overlapRight = boxRight - puckLeft;
        const overlapTop = puckBottom - boxTop;
        const overlapBottom = boxBottom - puckTop;
        
        // Find minimum overlap to determine collision side
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
        
        if (minOverlap === overlapLeft) {
          // Hit left side
          puck.position.x = boxLeft - puck.radius;
          puck.velocity.x *= -box.restitution;
        } else if (minOverlap === overlapRight) {
          // Hit right side
          puck.position.x = boxRight + puck.radius;
          puck.velocity.x *= -box.restitution;
        } else if (minOverlap === overlapTop) {
          // Hit top side
          puck.position.y = boxTop - puck.radius;
          puck.velocity.y *= -box.restitution;
        } else {
          // Hit bottom side
          puck.position.y = boxBottom + puck.radius;
          puck.velocity.y *= -box.restitution;
        }
        
        puck.bounceCount++;
      }
    }, []);
    
    // Check and handle L-shape obstacle collision (with hypotenuse)
    const handleLShapeCollision = useCallback((puck: Puck, lShape: LShapeObstacle): void => {
      const rotRad = (lShape.rotation * Math.PI) / 180;
      const cos = Math.cos(rotRad);
      const sin = Math.sin(rotRad);
      
      // Transform puck to local L-shape coordinates
      const dx = puck.position.x - lShape.position.x;
      const dy = puck.position.y - lShape.position.y;
      const localPuckX = dx * cos + dy * sin;
      const localPuckY = -dx * sin + dy * cos;
      
      const w = lShape.armWidth;
      const h = lShape.armHeight;
      
      // Define pentagon vertices in local coordinates
      const vertices = [
        { x: 0, y: -h / 2 },        // top-left of horizontal arm
        { x: w, y: -h / 2 },        // top-right of horizontal arm
        { x: w, y: h / 2 },         // bottom-right of horizontal arm
        { x: h / 2, y: h / 2 },     // inner corner right (start of hypotenuse)
        { x: h / 2, y: w },         // bottom-right of vertical arm
        { x: -h / 2, y: w },        // bottom-left of vertical arm
        { x: -h / 2, y: h / 2 },    // inner corner left (end of hypotenuse)
      ];
      
      // Check edges of the pentagon
      let minDistance = Infinity;
      let collisionNormalX = 0;
      let collisionNormalY = 0;
      
      for (let i = 0; i < vertices.length; i++) {
        const v1 = vertices[i];
        const v2 = vertices[(i + 1) % vertices.length];
        
        // Line segment from v1 to v2
        const edgeX = v2.x - v1.x;
        const edgeY = v2.y - v1.y;
        const edgeLength = Math.sqrt(edgeX * edgeX + edgeY * edgeY);
        
        if (edgeLength === 0) continue;
        
        // Vector from v1 to puck
        const toPuckX = localPuckX - v1.x;
        const toPuckY = localPuckY - v1.y;
        
        // Project puck onto edge
        const t = Math.max(0, Math.min(1, (toPuckX * edgeX + toPuckY * edgeY) / (edgeLength * edgeLength)));
        
        // Closest point on edge
        const pointX = v1.x + t * edgeX;
        const pointY = v1.y + t * edgeY;
        
        // Distance from puck to closest point
        const distX = localPuckX - pointX;
        const distY = localPuckY - pointY;
        const dist = Math.sqrt(distX * distX + distY * distY);
        
        if (dist < minDistance) {
          minDistance = dist;
          
          // Normal perpendicular to edge (pointing outward)
          collisionNormalX = -edgeY / edgeLength;
          collisionNormalY = edgeX / edgeLength;
          
          // Make sure normal points away from center of shape
          const centerX = (w - h / 2) / 2;
          const centerY = (w + h / 2) / 2;
          const toCenterX = centerX - pointX;
          const toCenterY = centerY - pointY;
          const dotToCenter = collisionNormalX * toCenterX + collisionNormalY * toCenterY;
          if (dotToCenter > 0) {
            collisionNormalX = -collisionNormalX;
            collisionNormalY = -collisionNormalY;
          }
        }
      }
      
      // Check if collision occurred
      if (minDistance < puck.radius) {
        const overlap = puck.radius - minDistance;
        
        // Rotate normal back to world space
        const worldNormalX = collisionNormalX * cos - collisionNormalY * sin;
        const worldNormalY = collisionNormalX * sin + collisionNormalY * cos;
        
        // Push puck out of collision
        puck.position.x += worldNormalX * overlap;
        puck.position.y += worldNormalY * overlap;
        
        // Reflect velocity along normal
        const dotProduct = puck.velocity.x * worldNormalX + puck.velocity.y * worldNormalY;
        puck.velocity.x -= 2 * dotProduct * worldNormalX * lShape.restitution;
        puck.velocity.y -= 2 * dotProduct * worldNormalY * lShape.restitution;
        
        puck.bounceCount++;
        
        soundManager.vibrate(5);
      }
    }, []);

    // Load participant images
    useEffect(() => {
      receivers.forEach((receiver) => {
        const userId = receiver.user_id;
        const pfpUrl = receiver.user?.pfp_url;

        // Skip if already cached or no URL
        if (imageCache.current.has(userId) || !pfpUrl) {
          return;
        }

        // Create and load image
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Enable CORS for external images

        img.onload = () => {
          imageCache.current.set(userId, img);
          // Update avatar imageLoaded status
          const avatar = avatarsRef.current.find(
            (a) => a.participantId === userId,
          );
          if (avatar) {
            avatar.imageElement = img;
            avatar.imageLoaded = true;
          }
        };

        img.onerror = () => {
          console.warn(`Failed to load image for user ${userId}`);
          imageCache.current.delete(userId);
        };

        img.src = pfpUrl;
      });
    }, [receivers]);

    // Initialize avatars with participant data
    useEffect(() => {
      const spacing = GAME_CONFIG.CANVAS_WIDTH / (receivers.length + 1);
      avatarsRef.current = receivers.map((receiver, i) => {
        const userId = receiver.user_id;
        const username = receiver.user?.username || 'Unknown';
        const cachedImage = imageCache.current.get(userId);

        return {
          id: i,
          participantId: userId,
          username,
          initials: getInitials(username),
          imageElement: cachedImage || null,
          imageLoaded: !!cachedImage,
          position: {
            x: spacing * (i + 1),
            y: GAME_CONFIG.AVATAR_Y_POSITION,
          },
          velocity: { x: 0, y: 0 },
          mass: GAME_CONFIG.AVATAR_MASS,
          radius: GAME_CONFIG.AVATAR_RADIUS,
          restitution: GAME_CONFIG.AVATAR_RESTITUTION,
          hitAnimation: 0,
          emoji: AVATAR_EMOJIS[i % AVATAR_EMOJIS.length], // Fallback emoji
        };
      });
      
      // Generate obstacles only once or when receiver count changes
      const shouldGenerateObstacles = 
        receivers.length > 0 && 
        (!obstaclesInitializedRef.current || lastReceiverCountRef.current !== receivers.length);
      
      if (shouldGenerateObstacles) {
        const { bumpers, boxObstacles, lShapes } = generateObstacles();
        bumpersRef.current = bumpers;
        boxObstaclesRef.current = boxObstacles;
        lShapesRef.current = lShapes;
        obstaclesInitializedRef.current = true;
        lastReceiverCountRef.current = receivers.length;
        // console.log(`Generated ${bumpers.length} bumpers, ${boxObstacles.length} boxes, and ${lShapes.length} L-shapes for ${receivers.length} receivers`);
      }
    }, [receivers, getInitials, generateObstacles]);

    // Create particles effect
    const createParticles = useCallback(
      (x: number, y: number, color: string) => {
        for (let i = 0; i < GAME_CONFIG.PARTICLE_COUNT; i++) {
          const angle = (Math.PI * 2 * i) / GAME_CONFIG.PARTICLE_COUNT;
          const speed = 2 + Math.random() * 3;
          particlesRef.current.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color,
            life: GAME_CONFIG.PARTICLE_LIFETIME,
            maxLife: GAME_CONFIG.PARTICLE_LIFETIME,
          });
        }
      },
      [],
    );

    // Handle pointer events
    const getPointerPosition = (
      e: React.PointerEvent<HTMLCanvasElement>,
    ): Vector2D => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      const scaleX = GAME_CONFIG.CANVAS_WIDTH / rect.width;
      const scaleY = GAME_CONFIG.CANVAS_HEIGHT / rect.height;

      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (isPaused) return;

      const pos = getPointerPosition(e);

      // Check if clicking near the puck starting position (bottom center)
      const puckStartY = GAME_CONFIG.CANVAS_HEIGHT - 80;
      const puckStartX = GAME_CONFIG.CANVAS_WIDTH / 2;
      const distance = Math.sqrt(
        Math.pow(pos.x - puckStartX, 2) + Math.pow(pos.y - puckStartY, 2),
      );

      if (distance < 60 && !puckRef.current) {
        setIsDragging(true);
        setDragStart(pos);
        setDragCurrent(pos);
        e.currentTarget.setPointerCapture(e.pointerId);
      }
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDragging || !dragStart) return;
      setDragCurrent(getPointerPosition(e));
    };

    const handlePointerUp = () => {
      if (!isDragging || !dragStart || !dragCurrent) return;

      const dx = dragStart.x - dragCurrent.x;
      const dy = dragStart.y - dragCurrent.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 10) {
        // Create puck with velocity
        const puckType = PUCK_TYPES[selectedPuck];
        const velocity = {
          x:
            dx *
            GAME_CONFIG.VELOCITY_MULTIPLIER *
            (isPowerMode ? GAME_CONFIG.POWER_SHOT_MULTIPLIER : 1),
          y:
            dy *
            GAME_CONFIG.VELOCITY_MULTIPLIER *
            (isPowerMode ? GAME_CONFIG.POWER_SHOT_MULTIPLIER : 1),
        };

        const clampedVelocity = clampMagnitude(
          velocity,
          GAME_CONFIG.MAX_FLICK_VELOCITY,
        );

        puckRef.current = {
          position: {
            x: GAME_CONFIG.CANVAS_WIDTH / 2,
            y: GAME_CONFIG.CANVAS_HEIGHT - 80,
          },
          velocity: clampedVelocity,
          mass: puckType.mass * GAME_CONFIG.PUCK_MASS,
          radius: GAME_CONFIG.PUCK_RADIUS,
          restitution: puckType.restitution,
          isAbsorbing: false,
          absorbProgress: 0,
          absorbTarget: null,
          hasScored: false,
          lastTrailPosition: null,
          trailCounter: 0,
          bounceCount: 0,
          hitBumpers: new Set(),
        };

        onShot();
        if (isPowerMode) {
          onPowerUsed();
        }

        soundManager.playFlick();
        soundManager.vibrate(10);
      }

      setIsDragging(false);
      setDragStart(null);
      setDragCurrent(null);
    };

    // Game loop
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      soundManager.initialize();

      const gameLoop = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const deltaTime = Math.min(
          (timestamp - lastTimeRef.current) / 16.67,
          2,
        ); // Cap at 2x for stability
        lastTimeRef.current = timestamp;

        // Clear canvas
        ctx.fillStyle = GAME_CONFIG.COLORS.BACKGROUND;
        ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

        if (!isPaused) {
          // Update and draw puck
          if (puckRef.current) {
            const puck = puckRef.current;

            if (puck.isAbsorbing) {
              // Absorption animation - progress based on time
              const progressIncrement =
                (16.67 * deltaTime) / GAME_CONFIG.ABSORPTION_DURATION;
              puck.absorbProgress += progressIncrement;

              if (puck.absorbProgress >= 1) {
                // Remove puck when absorption complete
                puckRef.current = null;
              } else if (puck.absorbTarget) {
                // Move toward avatar center and shrink

                // Smoothly move toward target
                puck.position.x +=
                  (puck.absorbTarget.x - puck.position.x) * 0.15 * deltaTime;
                puck.position.y +=
                  (puck.absorbTarget.y - puck.position.y) * 0.15 * deltaTime;

                // Add trailing particles during absorption
                if (Math.random() < 0.3 * deltaTime) {
                  const puckType = PUCK_TYPES[selectedPuck];
                  const angle = Math.random() * Math.PI * 2;
                  const speed = 1 + Math.random() * 2;
                  particlesRef.current.push({
                    x: puck.position.x,
                    y: puck.position.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color: puckType.color,
                    life: 300,
                    maxLife: 300,
                  });
                }

                // Clear velocity during absorption
                puck.velocity.x = 0;
                puck.velocity.y = 0;
              }
            } else {
              // Apply physics
              puck.velocity.y += GAME_CONFIG.GRAVITY * deltaTime;
              // Apply reduced friction based on bounce count (20% reduction per bounce)
              // Friction reduction: move friction coefficient closer to 1.0 (no friction)
              const frictionReduction = Math.pow(0.2, puck.bounceCount);
              const adjustedFriction = 1 - ((1 - GAME_CONFIG.FRICTION) * frictionReduction);
              puck.velocity = applyFriction(
                puck.velocity,
                adjustedFriction,
              );

              puck.position.x += puck.velocity.x * deltaTime;
              puck.position.y += puck.velocity.y * deltaTime;

              // Add persistent trail segments
              puck.trailCounter++;
              if (puck.trailCounter >= GAME_CONFIG.TRAIL_SAMPLE_RATE) {
                if (puck.lastTrailPosition) {
                  const puckType = PUCK_TYPES[selectedPuck];
                  const speed = magnitude(puck.velocity);
                  const width = Math.max(
                    2,
                    Math.min(puck.radius * 1.5, speed * 0.3),
                  );

                  trailSegmentsRef.current.push({
                    x1: puck.lastTrailPosition.x,
                    y1: puck.lastTrailPosition.y,
                    x2: puck.position.x,
                    y2: puck.position.y,
                    color: puckType.color,
                    life: GAME_CONFIG.TRAIL_FADE_TIME,
                    maxLife: GAME_CONFIG.TRAIL_FADE_TIME,
                    width: width,
                  });
                }

                puck.lastTrailPosition = {
                  x: puck.position.x,
                  y: puck.position.y,
                };
                puck.trailCounter = 0;
              }

              // Wall collisions with 20% speed boost on ricochet
              if (puck.position.x - puck.radius < 0) {
                puck.position.x = puck.radius;
                puck.velocity.x *= -GAME_CONFIG.WALL_RESTITUTION * 1.2;
                puck.bounceCount++;
              }
              if (puck.position.x + puck.radius > GAME_CONFIG.CANVAS_WIDTH) {
                puck.position.x = GAME_CONFIG.CANVAS_WIDTH - puck.radius;
                puck.velocity.x *= -GAME_CONFIG.WALL_RESTITUTION * 1.2;
                puck.bounceCount++;
              }
              if (puck.position.y - puck.radius < 0) {
                puck.position.y = puck.radius;
                puck.velocity.y *= -GAME_CONFIG.WALL_RESTITUTION * 1.2;
                puck.bounceCount++;
              }

              // Check bumper collisions (pass-through with speed reduction - once per bumper)
              bumpersRef.current.forEach((bumper) => {
                const isInBumper = checkBumperCollision(puck, bumper);
                const hasHitThisBumper = puck.hitBumpers.has(bumper.id);
                
                if (isInBumper && !hasHitThisBumper) {
                  // Apply speed reduction only once per bumper
                  puck.velocity.x *= bumper.speedReduction;
                  puck.velocity.y *= bumper.speedReduction;
                  puck.hitBumpers.add(bumper.id);
                  
                  soundManager.vibrate(5);
                } else if (!isInBumper && hasHitThisBumper) {
                  // Puck has exited the bumper, allow it to be hit again
                  puck.hitBumpers.delete(bumper.id);
                }
              });
              
              // Check box obstacle collisions
              boxObstaclesRef.current.forEach((box) => {
                handleBoxCollision(puck, box);
              });
              
              // Check L-shape obstacle collisions
              lShapesRef.current.forEach((lShape) => {
                handleLShapeCollision(puck, lShape);
              });

              // Check avatar collisions
              avatarsRef.current.forEach((avatar) => {
                if (checkCircleCollision(puck, avatar) && !puck.hasScored) {
                  // Start absorption animation
                  puck.isAbsorbing = true;
                  puck.absorbProgress = 0;
                  puck.absorbTarget = {
                    x: avatar.position.x,
                    y: avatar.position.y,
                  };
                  puck.hasScored = true;

                  // Trigger hit animation and score
                  avatar.hitAnimation = GAME_CONFIG.HIT_ANIMATION_DURATION;
                  const puckType = PUCK_TYPES[selectedPuck];
                  const score = Math.round(
                    GAME_CONFIG.SCORE_PER_HIT * puckType.scoreMultiplier,
                  );
                  const receiver = receivers.find(
                    (r) => r.user_id === avatar.participantId,
                  );
                  if (receiver) {
                    onHit(score, receiver);
                  }

                  // Regenerate obstacles after successful hit
                  const { bumpers, boxObstacles, lShapes } = generateObstacles();
                  bumpersRef.current = bumpers;
                  boxObstaclesRef.current = boxObstacles;
                  lShapesRef.current = lShapes;
                  // console.log(`Regenerated ${bumpers.length} bumpers, ${boxObstacles.length} boxes, and ${lShapes.length} L-shapes after hit`);

                  // Get combo tier for particle color
                  const getTier = (comboCount: number): number => {
                    const thresholds = GAME_CONFIG.COMBO_TIER_THRESHOLDS;
                    for (let i = thresholds.length - 1; i >= 0; i--) {
                      if (comboCount >= thresholds[i]) return i;
                    }
                    return -1;
                  };
                  
                  const tier = getTier(combo);
                  const particleColor = tier >= 0 
                    ? GAME_CONFIG.COMBO_PARTICLE_COLORS[tier] 
                    : puckType.color;
                  
                  // Create more particles at higher combos
                  const particleMultiplier = Math.min(1 + Math.floor(combo / 5), 3);
                  for (let i = 0; i < particleMultiplier; i++) {
                    createParticles(
                      avatar.position.x,
                      avatar.position.y,
                      particleColor,
                    );
                  }
                  
                  soundManager.playHit();
                  soundManager.vibrate(20);
                }
              });

              // Remove puck if off screen or stopped
              if (
                puck.position.y > GAME_CONFIG.CANVAS_HEIGHT + 50 ||
                (isStationary(puck.velocity, 0.5) &&
                  puck.position.y > GAME_CONFIG.CANVAS_HEIGHT - 100)
              ) {
                // If puck is removed without scoring, trigger miss
                if (!puck.hasScored) {
                  onMiss();
                }
                puckRef.current = null;
              }
            }
          }

          // Update avatars
          avatarsRef.current.forEach((avatar) => {
            // Apply physics
            avatar.velocity = applyFriction(avatar.velocity, 0.95);
            avatar.position.x += avatar.velocity.x * deltaTime;
            avatar.position.y += avatar.velocity.y * deltaTime;

            // Keep avatars in bounds
            if (avatar.position.x - avatar.radius < 0) {
              avatar.position.x = avatar.radius;
              avatar.velocity.x *= -0.5;
            }
            if (avatar.position.x + avatar.radius > GAME_CONFIG.CANVAS_WIDTH) {
              avatar.position.x = GAME_CONFIG.CANVAS_WIDTH - avatar.radius;
              avatar.velocity.x *= -0.5;
            }

            // Return to original Y position
            const targetY = GAME_CONFIG.AVATAR_Y_POSITION;
            avatar.position.y +=
              (targetY - avatar.position.y) * 0.1 * deltaTime;

            // Update animations
            if (avatar.hitAnimation > 0) {
              avatar.hitAnimation = Math.max(
                0,
                avatar.hitAnimation - 16.67 * deltaTime,
              );
            }
          });

          // Update particles
          particlesRef.current = particlesRef.current.filter((particle) => {
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            particle.vy += 0.2 * deltaTime;
            particle.life -= 16.67 * deltaTime;
            return particle.life > 0;
          });

          // Update trail segments (transition to gray, keep them)
          trailSegmentsRef.current.forEach((segment) => {
            segment.life = Math.max(0, segment.life - 16.67 * deltaTime);
          });
        }

        // Draw persistent trail segments (behind everything)
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        trailSegmentsRef.current.forEach((segment) => {
          // Calculate color transition factor (1 = original color, 0 = gray)
          const colorFactor = segment.life / segment.maxLife;

          // Convert hex color to rgb
          let r = 255,
            g = 255,
            b = 255;
          if (segment.color.startsWith('#')) {
            const hex = segment.color.slice(1);
            r = parseInt(hex.slice(0, 2), 16);
            g = parseInt(hex.slice(2, 4), 16);
            b = parseInt(hex.slice(4, 6), 16);
          }

          // Calculate grayscale value (using standard luminance formula)
          const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

          // Interpolate between original color and gray
          const finalR = Math.round(r * colorFactor + gray * (1 - colorFactor));
          const finalG = Math.round(g * colorFactor + gray * (1 - colorFactor));
          const finalB = Math.round(b * colorFactor + gray * (1 - colorFactor));

          ctx.strokeStyle = `rgba(${finalR}, ${finalG}, ${finalB}, 0.6)`;
          ctx.lineWidth = segment.width;
          ctx.beginPath();
          ctx.moveTo(segment.x1, segment.y1);
          ctx.lineTo(segment.x2, segment.y2);
          ctx.stroke();
        });

        ctx.restore();

        // Draw box obstacles
        boxObstaclesRef.current.forEach((box) => {
          ctx.save();
          
          // Shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.fillRect(
            box.position.x + 2,
            box.position.y + 2,
            box.width,
            box.height
          );
          
          // Create gradient for box
          const gradient = ctx.createLinearGradient(
            box.position.x,
            box.position.y,
            box.position.x + box.width,
            box.position.y + box.height
          );
          gradient.addColorStop(0, GAME_CONFIG.COLORS.BOX_OBSTACLE);
          gradient.addColorStop(1, GAME_CONFIG.COLORS.ACCENT);
          
          // Draw rounded rectangle
          const radius = 8;
          ctx.fillStyle = gradient;
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.moveTo(box.position.x + radius, box.position.y);
          ctx.lineTo(box.position.x + box.width - radius, box.position.y);
          ctx.quadraticCurveTo(
            box.position.x + box.width,
            box.position.y,
            box.position.x + box.width,
            box.position.y + radius
          );
          ctx.lineTo(box.position.x + box.width, box.position.y + box.height - radius);
          ctx.quadraticCurveTo(
            box.position.x + box.width,
            box.position.y + box.height,
            box.position.x + box.width - radius,
            box.position.y + box.height
          );
          ctx.lineTo(box.position.x + radius, box.position.y + box.height);
          ctx.quadraticCurveTo(
            box.position.x,
            box.position.y + box.height,
            box.position.x,
            box.position.y + box.height - radius
          );
          ctx.lineTo(box.position.x, box.position.y + radius);
          ctx.quadraticCurveTo(
            box.position.x,
            box.position.y,
            box.position.x + radius,
            box.position.y
          );
          ctx.closePath();
          ctx.fill();
          
          // Border
          ctx.globalAlpha = 1;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          ctx.restore();
        });
        
        // Draw L-shape obstacles (with hypotenuse)
        lShapesRef.current.forEach((lShape) => {
          ctx.save();
          
          // Translate to L-shape center
          ctx.translate(lShape.position.x, lShape.position.y);
          
          // Rotate
          ctx.rotate((lShape.rotation * Math.PI) / 180);
          
          // L-shape with hypotenuse: pentagon shape
          // Forms an L with a diagonal cut at the inner corner
          const w = lShape.armWidth;
          const h = lShape.armHeight;
          
          // Shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.beginPath();
          ctx.moveTo(2, -h / 2 + 2);
          ctx.lineTo(w + 2, -h / 2 + 2);
          ctx.lineTo(w + 2, h / 2 + 2);
          ctx.lineTo(h / 2 + 2, h / 2 + 2);
          ctx.lineTo(h / 2 + 2, w + 2);
          ctx.lineTo(-h / 2 + 2, w + 2);
          ctx.lineTo(-h / 2 + 2, h / 2 + 2);
          ctx.closePath();
          ctx.fill();
          
          // Create gradient
          const gradient = ctx.createLinearGradient(-h / 2, -h / 2, w, w);
          gradient.addColorStop(0, GAME_CONFIG.COLORS.BOX_OBSTACLE);
          gradient.addColorStop(1, GAME_CONFIG.COLORS.ACCENT);
          
          // Draw L-shape pentagon
          ctx.fillStyle = gradient;
          ctx.globalAlpha = 0.85;
          ctx.beginPath();
          
          // Pentagon shape with hypotenuse
          ctx.moveTo(0, -h / 2);          // Start at top-left
          ctx.lineTo(w, -h / 2);          // Top-right of horizontal arm
          ctx.lineTo(w, h / 2);           // Bottom-right of horizontal arm
          ctx.lineTo(h / 2, h / 2);       // Inner corner right
          ctx.lineTo(h / 2, w);           // Bottom-right of vertical arm
          ctx.lineTo(-h / 2, w);          // Bottom-left of vertical arm
          ctx.lineTo(-h / 2, h / 2);      // Inner corner left (before hypotenuse)
          ctx.closePath();                // Closes with hypotenuse to start
          ctx.fill();
          
          // Border
          ctx.globalAlpha = 1;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, -h / 2);
          ctx.lineTo(w, -h / 2);
          ctx.lineTo(w, h / 2);
          ctx.lineTo(h / 2, h / 2);
          ctx.lineTo(h / 2, w);
          ctx.lineTo(-h / 2, w);
          ctx.lineTo(-h / 2, h / 2);
          ctx.lineTo(0, -h / 2);
          ctx.stroke();
          
          // Highlight the hypotenuse edge (diagonal from vertex 6 to vertex 0)
          // ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          // ctx.lineWidth = 3;
          // ctx.beginPath();
          // ctx.moveTo(-h / 2, h / 2);
          // ctx.lineTo(0, -h / 2);
          // ctx.stroke();
          
          ctx.restore();
        });
        
        // Draw bumpers
        bumpersRef.current.forEach((bumper) => {
          ctx.save();
          
          // Shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.beginPath();
          ctx.ellipse(
            bumper.position.x + 2,
            bumper.position.y + 2,
            bumper.radius * 0.8,
            bumper.radius * 0.3,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();
          
          // Create radial gradient for bumper with pulsing effect
          const pulsePhase = (timestamp / 1000) % 1;
          const pulseScale = 1 + Math.sin(pulsePhase * Math.PI * 2) * 0.05;
          
          const gradient = ctx.createRadialGradient(
            bumper.position.x - bumper.radius * 0.3,
            bumper.position.y - bumper.radius * 0.3,
            0,
            bumper.position.x,
            bumper.position.y,
            bumper.radius * pulseScale
          );
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
          gradient.addColorStop(0.4, GAME_CONFIG.COLORS.BUMPER);
          gradient.addColorStop(1, GAME_CONFIG.COLORS.ACCENT);
          
          // Draw bumper circle
          ctx.fillStyle = gradient;
          ctx.globalAlpha = 0.85;
          ctx.beginPath();
          ctx.arc(
            bumper.position.x,
            bumper.position.y,
            bumper.radius,
            0,
            Math.PI * 2
          );
          ctx.fill();
          
          // Outer glow
          ctx.globalAlpha = 0.3;
          ctx.strokeStyle = GAME_CONFIG.COLORS.BUMPER;
          ctx.lineWidth = 4;
          ctx.stroke();
          
          // Border
          ctx.globalAlpha = 1;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(
            bumper.position.x,
            bumper.position.y,
            bumper.radius,
            0,
            Math.PI * 2
          );
          ctx.stroke();
          
          ctx.restore();
        });

        // Draw avatars
        avatarsRef.current.forEach((avatar) => {
          const scale =
            avatar.hitAnimation > 0
              ? 1 +
                0.3 * (avatar.hitAnimation / GAME_CONFIG.HIT_ANIMATION_DURATION)
              : 1;

          // Glow effect during hit animation
          if (avatar.hitAnimation > 0) {
            const glowAlpha =
              avatar.hitAnimation / GAME_CONFIG.HIT_ANIMATION_DURATION;
            const puckType = PUCK_TYPES[selectedPuck];
            
            // Get combo tier for glow color
            const getTier = (comboCount: number): number => {
              const thresholds = GAME_CONFIG.COMBO_TIER_THRESHOLDS;
              for (let i = thresholds.length - 1; i >= 0; i--) {
                if (comboCount >= thresholds[i]) return i;
              }
              return -1;
            };
            
            const tier = getTier(combo);
            const glowColor = tier >= 0 
              ? GAME_CONFIG.COMBO_PARTICLE_COLORS[tier] 
              : puckType.color;
            
            // Scale glow size with combo
            const glowScale = 1.8 + Math.min(combo * 0.1, 1.0);

            ctx.save();
            ctx.globalAlpha = glowAlpha * 0.6;
            const gradient = ctx.createRadialGradient(
              avatar.position.x,
              avatar.position.y,
              avatar.radius * 0.5,
              avatar.position.x,
              avatar.position.y,
              avatar.radius * glowScale,
            );
            gradient.addColorStop(0, glowColor);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(
              avatar.position.x,
              avatar.position.y,
              avatar.radius * glowScale,
              0,
              Math.PI * 2,
            );
            ctx.fill();
            ctx.restore();
          }

          // Shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.beginPath();
          ctx.ellipse(
            avatar.position.x,
            avatar.position.y + avatar.radius + 5,
            avatar.radius * 0.8,
            avatar.radius * 0.3,
            0,
            0,
            Math.PI * 2,
          );
          ctx.fill();

          // Avatar circle with image or fallback
          ctx.save();
          ctx.translate(avatar.position.x, avatar.position.y);
          ctx.scale(scale, scale);

          // Create circular clip
          ctx.beginPath();
          ctx.arc(0, 0, avatar.radius, 0, Math.PI * 2);
          ctx.clip();

          if (avatar.imageLoaded && avatar.imageElement) {
            // Draw the image
            ctx.drawImage(
              avatar.imageElement,
              -avatar.radius,
              -avatar.radius,
              avatar.radius * 2,
              avatar.radius * 2,
            );
            // After drawing the image, add a border
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, avatar.radius, 0, Math.PI * 2);
            ctx.stroke();
          } else {
            // Fallback: gradient background with initials or emoji
            ctx.fillStyle = GAME_CONFIG.COLORS.ACCENT;
            ctx.beginPath();
            ctx.arc(0, 0, avatar.radius, 0, Math.PI * 2);
            ctx.fill();

            // Draw initials or emoji
            if (avatar.initials) {
              ctx.fillStyle = 'white';
              ctx.font = `bold ${avatar.radius * 0.8}px Arial`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(avatar.initials, 0, 0);
            } else {
              ctx.font = `${avatar.radius * 1.2}px Arial`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(avatar.emoji, 0, 0);
            }
          }

          ctx.restore();

          // Optional: Draw username below avatar (small text)
          if (avatar.username) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(
              avatar.username,
              avatar.position.x,
              avatar.position.y + avatar.radius + 15,
            );
          }
        });

        // Draw puck
        if (puckRef.current) {
          const puck = puckRef.current;
          const puckType = PUCK_TYPES[selectedPuck];

          // Calculate scale and opacity for absorption animation
          const scale = puck.isAbsorbing ? 1 - puck.absorbProgress : 1;
          const opacity = puck.isAbsorbing ? 1 - puck.absorbProgress * 0.5 : 1;

          ctx.save();
          ctx.globalAlpha = opacity;

          // Shadow (only if not too small)
          if (scale > 0.3) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.ellipse(
              puck.position.x,
              puck.position.y + puck.radius * scale + 3,
              puck.radius * scale * 0.7,
              puck.radius * scale * 0.25,
              0,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          }

          // Puck with scale
          ctx.translate(puck.position.x, puck.position.y);
          ctx.scale(scale, scale);

          ctx.fillStyle = puckType.color;
          ctx.beginPath();
          ctx.arc(0, 0, puck.radius, 0, Math.PI * 2);
          ctx.fill();

          // Emoji
          ctx.font = `${puck.radius * 1.5}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(puckType.emoji, 0, 0);

          ctx.restore();
        }

        // Draw drag indicator
        if (isDragging && dragStart && dragCurrent && !puckRef.current) {
          const startX = GAME_CONFIG.CANVAS_WIDTH / 2;
          const startY = GAME_CONFIG.CANVAS_HEIGHT - 80;

          // Aim line
          ctx.strokeStyle = isPowerMode
            ? 'rgba(255, 215, 0, 0.8)'
            : 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = isPowerMode ? 4 : 3;
          ctx.setLineDash([10, 10]);
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(dragCurrent.x, dragCurrent.y);
          ctx.stroke();
          ctx.setLineDash([]);

          // Power indicator
          const dx = dragStart.x - dragCurrent.x;
          const dy = dragStart.y - dragCurrent.y;
          const power = Math.min(magnitude({ x: dx, y: dy }) / 100, 1);

          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(startX - 50, startY + 40, 100, 10);

          const gradient = ctx.createLinearGradient(
            startX - 50,
            0,
            startX + 50,
            0,
          );
          gradient.addColorStop(0, '#4CAF50');
          gradient.addColorStop(0.5, '#FFC107');
          gradient.addColorStop(1, '#FF5252');

          ctx.fillStyle = gradient;
          ctx.fillRect(startX - 50, startY + 40, 100 * power, 10);
        }

        // Draw particles
        particlesRef.current.forEach((particle) => {
          const alpha = particle.life / particle.maxLife;
          ctx.fillStyle = particle.color
            .replace(')', `, ${alpha})`)
            .replace('rgb', 'rgba');
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw launch zone indicator when no puck is active
        if (!puckRef.current && !isDragging) {
          const startX = GAME_CONFIG.CANVAS_WIDTH / 2;
          const startY = GAME_CONFIG.CANVAS_HEIGHT - 80;
          const puckType = PUCK_TYPES[selectedPuck];

          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.beginPath();
          ctx.arc(startX, startY, 50, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Show puck preview
          ctx.font = '40px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(puckType.emoji, startX, startY);
        }

        animationFrameRef.current = requestAnimationFrame(gameLoop);
      };

      animationFrameRef.current = requestAnimationFrame(gameLoop);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [
      selectedPuck,
      isDragging,
      dragStart,
      dragCurrent,
      isPowerMode,
      onHit,
      onMiss,
      createParticles,
      isPaused,
      receivers,
      checkBumperCollision,
      handleBoxCollision,
      handleLShapeCollision,
      generateObstacles,
      combo,
    ]);

    const captureAndShare = useCallback(async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        canvas.toBlob(async (blob) => {
          if (!blob) return;

          try {
            // Copy to clipboard
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob }),
            ]);

            // Optional: Show success feedback
            console.log('Canvas copied to clipboard! ✓');
            // You could also trigger a toast notification here if you have a toast system
          } catch (clipboardError) {
            console.error('Failed to copy to clipboard:', clipboardError);

            // Fallback to download if clipboard fails
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `token-toss-${eventId}-${Date.now()}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      } catch (error) {
        console.error('Error capturing canvas:', error);
      }
    }, [eventId]);

    useImperativeHandle(
      ref,
      () => ({
        captureCanvas: captureAndShare,
      }),
      [captureAndShare],
    );

    return (
      <canvas
        ref={canvasRef}
        width={GAME_CONFIG.CANVAS_WIDTH}
        height={GAME_CONFIG.CANVAS_HEIGHT}
        className="w-full h-full touch-none"
        style={{ imageRendering: 'crisp-edges' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
    );
  },
);
