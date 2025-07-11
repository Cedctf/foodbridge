import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../contexts/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Animated Background Components
const CanvasRevealEffect = ({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
  reverse = false
}) => {
  return (
    <div className={`h-full relative w-full ${containerClassName}`}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors ?? [[0, 255, 255]]}
          dotSize={dotSize ?? 3}
          opacities={
            opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
          }
          shader={`
            ${reverse ? 'u_reverse_active' : 'false'}_;
            animation_speed_factor_${animationSpeed.toFixed(1)}_;
          `}
          center={["x", "y"]} />
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-green-50/50 to-transparent" />
      )}
    </div>
  );
};

const DotMatrix = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 20,
  dotSize = 2,
  shader = "",
  center = ["x", "y"],
}) => {
  const uniforms = useMemo(() => {
    let colorsArray = [
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
    ];
    if (colors.length === 2) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1],
      ];
    } else if (colors.length === 3) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[2],
        colors[2],
      ];
    }
    return {
      u_colors: {
        value: colorsArray.map((color) => [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
        ]),
        type: "uniform3fv",
      },
      u_opacities: {
        value: opacities,
        type: "uniform1fv",
      },
      u_total_size: {
        value: totalSize,
        type: "uniform1f",
      },
      u_dot_size: {
        value: dotSize,
        type: "uniform1f",
      },
      u_reverse: {
        value: shader.includes("u_reverse_active") ? 1 : 0,
        type: "uniform1i",
      },
    };
  }, [colors, opacities, totalSize, dotSize, shader]);

  return (
    <Shader
      source={`
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        uniform int u_reverse;

        out vec4 fragColor;

        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
            return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }
        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }

        void main() {
            vec2 st = fragCoord.xy;
            ${
              center.includes("x")
                ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }
            ${
              center.includes("y")
                ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }

            float opacity = step(0.0, st.x);
            opacity *= step(0.0, st.y);

            vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

            float frequency = 5.0;
            float show_offset = random(st2);
            float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
            opacity *= u_opacities[int(rand * 10.0)];
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

            vec3 color = u_colors[int(show_offset * 6.0)];

            float animation_speed_factor = 0.5;
            vec2 center_grid = u_resolution / 2.0 / u_total_size;
            float dist_from_center = distance(center_grid, st2);

            float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15);

            float max_grid_dist = distance(center_grid, vec2(0.0, 0.0));
            float timing_offset_outro = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2);

            float current_timing_offset;
            if (u_reverse == 1) {
                current_timing_offset = timing_offset_outro;
                 opacity *= 1.0 - step(current_timing_offset, u_time * animation_speed_factor);
                 opacity *= clamp((step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            } else {
                current_timing_offset = timing_offset_intro;
                 opacity *= step(current_timing_offset, u_time * animation_speed_factor);
                 opacity *= clamp((1.0 - step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            }

            fragColor = vec4(color, opacity);
            fragColor.rgb *= fragColor.a;
        }`}
      uniforms={uniforms}
      maxFps={60} />
  );
};

const ShaderMaterial = ({
  source,
  uniforms,
  maxFps = 60
}) => {
  const { size } = useThree();
  const ref = useRef(null);
  let lastFrameTime = 0;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const timestamp = clock.getElapsedTime();
    lastFrameTime = timestamp;
    const material = ref.current.material;
    const timeLocation = material.uniforms.u_time;
    timeLocation.value = timestamp;
  });

  const getUniforms = useCallback(() => {
    const preparedUniforms = {};

    for (const uniformName in uniforms) {
      const uniform = uniforms[uniformName];

      switch (uniform.type) {
        case "uniform1f":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1f" };
          break;
        case "uniform1i":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1i" };
          break;
        case "uniform3f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector3().fromArray(uniform.value),
            type: "3f",
          };
          break;
        case "uniform1fv":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1fv" };
          break;
        case "uniform3fv":
          preparedUniforms[uniformName] = {
            value: uniform.value.map((v) =>
              new THREE.Vector3().fromArray(v)),
            type: "3fv",
          };
          break;
        case "uniform2f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector2().fromArray(uniform.value),
            type: "2f",
          };
          break;
        default:
          console.error(`Invalid uniform type for '${uniformName}'.`);
          break;
      }
    }

    preparedUniforms["u_time"] = { value: 0, type: "1f" };
    preparedUniforms["u_resolution"] = {
      value: new THREE.Vector2(size.width * 2, size.height * 2),
    };
    return preparedUniforms;
  }, [uniforms, size.width, size.height]);

  const material = useMemo(() => {
    const materialObject = new THREE.ShaderMaterial({
      vertexShader: `
      precision mediump float;
      in vec2 coordinates;
      uniform vec2 u_resolution;
      out vec2 fragCoord;
      void main(){
        float x = position.x;
        float y = position.y;
        gl_Position = vec4(x, y, 0.0, 1.0);
        fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }
      `,
      fragmentShader: source,
      uniforms: getUniforms(),
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
    });

    return materialObject;
  }, [source, getUniforms]);

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader = ({ source, uniforms, maxFps = 60 }) => {
  return (
    <Canvas className="absolute inset-0 h-full w-full">
      <ShaderMaterial source={source} uniforms={uniforms} maxFps={maxFps} />
    </Canvas>
  );
};

export default function Login() {
  const [form, setForm] = useState({
    identifier: '', // Can be username or email
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showBackgroundAnimation, setShowBackgroundAnimation] = useState(false);
  const router = useRouter();
  const { login } = useUser();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setShowBackgroundAnimation(true);

    try {
      const result = await login(form);

      if (result.success) {
        setSuccess(`Welcome back, ${result.user.username}!`);
        setShowSuccessAnimation(true);
        
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/profile'); // Redirect to profile page
        }, 2000);
      } else {
        setError(result.error || 'Login failed');
        setShowBackgroundAnimation(false);
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      setShowBackgroundAnimation(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          {showBackgroundAnimation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0">
              <CanvasRevealEffect
                animationSpeed={3}
                containerClassName="bg-gradient-to-br from-green-50 via-white to-emerald-50"
                colors={[
                  [69, 161, 128], // #45a180
                  [69, 161, 128], // #45a180
                ]}
                dotSize={4}
                reverse={false} />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/50 to-transparent" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Main content container */}
        <div className="flex flex-1 flex-col justify-center items-center -mt-20">
          <div className="w-full max-w-md px-4">
            <AnimatePresence mode="wait">
              {!showSuccessAnimation ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-10 space-y-8 text-center">
                  
                  <div className="space-y-1">
                    <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-gray-900">
                      Welcome Back
                    </h1>
                    <p className="text-[1.25rem] text-gray-600 font-light">
                      Sign in to your Food Bridge account
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          id="identifier"
                          name="identifier"
                          value={form.identifier}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          placeholder="Username or Email"
                          className="w-full backdrop-blur-[1px] text-[#45a180] border-1 border-[#45a180] rounded-full py-3 px-4 focus:outline-none focus:border focus:border-[#45a180] text-center bg-white/50"
                        />
                      </div>
                      
                      <div className="relative">
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          placeholder="Password"
                          className="w-full backdrop-blur-[1px] text-[#45a180] border-1 border-[#45a180] rounded-full py-3 px-4 focus:outline-none focus:border focus:border-[#45a180] text-center bg-white/50"
                        />
                      </div>
                      
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-full py-2 px-4">
                          {error}
                        </motion.div>
                      )}
                      
                      {success && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-full py-2 px-4">
                          {success}
                        </motion.div>
                      )}
                      
                                              <motion.button
                          type="submit"
                          disabled={loading}
                          className={`w-full rounded-full font-medium py-3 border transition-all duration-300 ${
                            loading 
                            ? "bg-white text-[#45a180] border-[#45a180] cursor-not-allowed" 
                            : "bg-gradient-to-r from-emerald-400 to-emerald-600 text-white border-transparent hover:from-emerald-500 hover:to-emerald-700 cursor-pointer shadow-lg"
                          }`}
                          whileHover={!loading ? { scale: 1.02 } : {}}
                          whileTap={!loading ? { scale: 0.98 } : {}}
                          transition={{ duration: 0.2 }}>
                          {loading ? 'Signing In...' : 'Sign In'}
                        </motion.button>
                    </form>
                  </div>
                  
                  <div className="space-y-4">
                                         <motion.p
                       className="text-[oklch(59.6%_0.145_163.225)] hover:text-[oklch(59.6%_0.145_163.225)]/80 transition-colors cursor-pointer text-sm"
                       whileHover={{ scale: 1.02 }}
                       transition={{ duration: 0.2 }}>
                       <Link href="/forgot-password" className="underline">
                         Forgot your password?
                       </Link>
                     </motion.p>
                     
                     <p className="text-gray-600 text-sm">
                       Don&apos;t have an account?{' '}
                       <Link
                         href="/register"
                         className="underline text-emerald-600 hover:text-emerald-700 transition-colors">
                         Create one here
                       </Link>
                     </p>
                  </div>
                  
                                     <div className="pt-2">
                     <p className="text-xs text-gray-500">
                       By signing in, you agree to the{' '}
                       <Link href="#" className="underline text-emerald-600 hover:text-emerald-700 transition-colors">
                         Terms of Service
                       </Link>
                       ,{' '}
                       <Link href="#" className="underline text-emerald-600 hover:text-emerald-700 transition-colors">
                         Privacy Policy
                       </Link>
                       , and{' '}
                       <Link href="#" className="underline text-emerald-600 hover:text-emerald-700 transition-colors">
                         Cookie Policy
                       </Link>
                       .
                     </p>
                   </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success-screen"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
                  className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-10 space-y-8 text-center">
                  
                                     <div className="space-y-1">
                     <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-gray-900">
                       Welcome Back!
                     </h1>
                     <p className="text-[1.25rem] text-gray-600 font-light">
                       Redirecting to your profile...
                     </p>
                   </div>
                  
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="py-10">
                                         <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                       <svg
                         xmlns="http://www.w3.org/2000/svg"
                         className="h-8 w-8 text-white"
                         viewBox="0 0 20 20"
                         fill="currentColor">
                         <path
                           fillRule="evenodd"
                           d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                           clipRule="evenodd" />
                       </svg>
                     </div>
                  </motion.div>
                  
                                     <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 1 }}
                     className="w-full rounded-full bg-emerald-500/10 text-emerald-600 font-medium py-3 border border-emerald-500/30">
                     Redirecting...
                   </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
} 