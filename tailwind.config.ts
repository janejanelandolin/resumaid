
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-out': {
					'0%': {
						opacity: '1',
						transform: 'translateY(0)'
					},
					'100%': {
						opacity: '0',
						transform: 'translateY(10px)'
					}
				},
				'typewriter': {
					to: { 
						width: '100%' 
					},
				},
				'blink': {
					'0%': {
						borderColor: 'transparent'
					},
					'50%': {
						borderColor: 'currentColor'
					},
					'100%': {
						borderColor: 'transparent'
					}
				},
				'rotate-text': {
					'0%': {
						transform: 'translateY(0%)'
					},
					'15%': {
						transform: 'translateY(0%)'
					},
					'20%': {
						transform: 'translateY(-25%)'
					},
					'40%': {
						transform: 'translateY(-25%)'
					},
					'45%': {
						transform: 'translateY(-50%)'
					},
					'65%': {
						transform: 'translateY(-50%)'
					},
					'70%': {
						transform: 'translateY(-75%)'
					},
					'90%': {
						transform: 'translateY(-75%)'
					},
					'95%, 100%': {
						transform: 'translateY(-100%)'
					}
				},
				'rotate-testimonials': {
					'0%': {
						transform: 'translateY(0%)',
						opacity: '0'
					},
					'5%': {
						transform: 'translateY(0%)',
						opacity: '1'
					},
					'25%': {
						transform: 'translateY(0%)',
						opacity: '1'
					},
					'30%': {
						transform: 'translateY(-100%)',
						opacity: '0'
					},
					'33.33%': {
						transform: 'translateY(100%)',
						opacity: '0'
					},
					'38.33%': {
						transform: 'translateY(0%)',
						opacity: '1'
					},
					'58.33%': {
						transform: 'translateY(0%)',
						opacity: '1'
					},
					'63.33%': {
						transform: 'translateY(-100%)',
						opacity: '0'
					},
					'66.66%': {
						transform: 'translateY(100%)',
						opacity: '0'
					},
					'71.66%': {
						transform: 'translateY(0%)',
						opacity: '1'
					},
					'91.66%': {
						transform: 'translateY(0%)',
						opacity: '1'
					},
					'96.66%, 100%': {
						transform: 'translateY(-100%)',
						opacity: '0'
					}
				},
				'dial-animation': {
					from: {
						'stroke-dashoffset': '400'
					},
					to: {
						'stroke-dashoffset': '0'
					}
				},
				'confetti': {
					'0%': {
						transform: 'translateY(0) rotateX(0) rotateY(0)'
					},
					'100%': {
						transform: 'translateY(1000px) rotateX(720deg) rotateY(720deg)'
					}
				},
				'spin-slow': {
					'0%': {
						transform: 'rotate(0deg)'
					},
					'100%': {
						transform: 'rotate(360deg)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-out': 'fade-out 0.5s ease-out',
				'typewriter': 'typewriter 3s steps(40) forwards',
				'cursor-blink': 'blink 0.7s infinite',
				'rotate-text': 'rotate-text 12s infinite',
				'rotate-testimonials': 'rotate-testimonials 24s infinite',
				'dial-animation': 'dial-animation 1.5s ease forwards',
				'confetti': 'confetti 5s ease-in-out forwards',
				'spin-slow': 'spin-slow 10s linear infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
