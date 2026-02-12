// HPI 1.7-V
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  ArrowRight,
  Heart,
  Activity,
  Shield,
  MapPin,
  Bell,
  Award,
  ChevronRight,
  Droplet,
  Hospital,
  Users,
  Search
} from 'lucide-react';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax for Hero
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background font-paragraph text-secondary overflow-clip selection:bg-primary selection:text-primary-foreground">
      <Header />

      {/* HERO SECTION - Inspired by Image Layout */}
      <section ref={heroRef} className="relative w-full min-h-screen md:h-[95vh] md:min-h-[800px] flex items-center overflow-hidden">
        {/* Parallax Background Image */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src="https://static.wixstatic.com/media/cea3b9_78e43109afe34231b4646ef9e9401b81~mv2.png?originWidth=1920&originHeight=768"
            alt="Blood donation community connection"
            className="w-full h-full object-cover"
            width={1920}
          />
          {/* Subtle overlay to ensure text contrast if needed, though the card handles most */}
          <div className="absolute inset-0 bg-secondary/10" />
        </motion.div>

        {/* Floating Content Card - The "Signature" Layout Element */}
        <div className="relative z-10 w-full max-w-[120rem] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 pointer-events-none py-8 md:py-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto w-full max-w-2xl bg-background shadow-2xl overflow-hidden rounded-sm"
          >
            {/* Card Body */}
            <div className="p-6 sm:p-8 md:p-10 lg:p-14 flex flex-col gap-4 md:gap-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="h-px w-12 bg-primary"></span>
                <span className="text-primary font-semibold tracking-widest uppercase text-xs sm:text-sm">The Lifeline Project</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] text-secondary">
                Blood Bridge: <br />
                <span className="italic text-primary">Connecting</span> Life to Life
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-secondary/80 leading-relaxed max-w-lg">
                जीवन बचाने का सबसे बड़ा माध्यम। An advanced digital ecosystem bridging the gap between donors, hospitals, and those in critical need.
              </p>
            </div>

            {/* Card Action Bar - The "Dark Bar" from inspiration */}
            <div className="bg-primary p-0">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-primary-foreground/20">
                <Link to="/public-registration" className="group relative overflow-hidden flex flex-col md:flex-row items-center justify-between px-3 sm:px-4 md:px-8 py-4 md:py-6 hover:bg-primary/90 transition-colors">
                  <span className="text-primary-foreground font-heading text-xs sm:text-sm md:text-lg relative z-10 text-center md:text-left">Register</span>
                  <ArrowRight className="text-primary-foreground w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transform group-hover:translate-x-1 transition-transform relative z-10 mt-2 md:mt-0" />
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
                <Link to="/public-login" className="group relative overflow-hidden flex flex-col md:flex-row items-center justify-between px-3 sm:px-4 md:px-8 py-4 md:py-6 bg-secondary hover:bg-secondary/90 transition-colors">
                  <span className="text-primary-foreground font-heading text-xs sm:text-sm md:text-lg relative z-10 text-center md:text-left">Donor Login</span>
                  <ArrowRight className="text-primary-foreground w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transform group-hover:translate-x-1 transition-transform relative z-10 mt-2 md:mt-0" />
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
                <Link to="/hospital-registration" className="group relative overflow-hidden flex flex-col md:flex-row items-center justify-between px-3 sm:px-4 md:px-8 py-4 md:py-6 bg-primary/80 hover:bg-primary/70 transition-colors">
                  <span className="text-primary-foreground font-heading text-xs sm:text-sm md:text-lg relative z-10 text-center md:text-left">Hospital Reg</span>
                  <Hospital className="text-primary-foreground w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transform group-hover:scale-110 transition-transform relative z-10 mt-2 md:mt-0" />
                </Link>
                <Link to="/hospital-login" className="group relative overflow-hidden flex flex-col md:flex-row items-center justify-between px-3 sm:px-4 md:px-8 py-4 md:py-6 bg-primary/70 hover:bg-primary/60 transition-colors">
                  <span className="text-primary-foreground font-heading text-xs sm:text-sm md:text-lg relative z-10 text-center md:text-left">Hospital Login</span>
                  <ArrowRight className="text-primary-foreground w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transform group-hover:translate-x-1 transition-transform relative z-10 mt-2 md:mt-0" />
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* EDITORIAL INTRO - "Introducing Our Masterpieces" style */}
      <section className="py-16 md:py-32 px-4 sm:px-6 md:px-12 lg:px-20 max-w-[120rem] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-secondary/60">Our Mission</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-secondary leading-tight mb-6 md:mb-8">
              Your Safety, <br />
              <span className="text-primary/80">Our Priority.</span>
            </h2>
            <p className="text-base sm:text-lg text-secondary/70 leading-relaxed mb-6 md:mb-8">
              Blood Bridge is not just a platform; it is a promise. A promise to ensure that no life is lost due to the unavailability of blood. We integrate public donors, hospitals, and blood banks into a single, cohesive network.
            </p>
            <Link to="/about">
              <Button variant="link" className="p-0 text-primary text-base sm:text-lg font-semibold hover:text-secondary transition-colors">
                Learn about our vision <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
          </div>

          <div className="lg:col-span-8 grid gap-6 md:gap-8">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-sm">
               <Image
                src="https://static.wixstatic.com/media/cea3b9_d7f84c81f95b4855be07fe9e83cb1d99~mv2.png?originWidth=1152&originHeight=640"
                alt="Medical professionals working"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                width={1200}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4 md:gap-8 mt-4 md:mt-8">
              <div className="bg-pastelbeige p-6 sm:p-8 md:p-10 rounded-sm">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4 md:mb-6" />
                <h3 className="font-heading text-xl sm:text-2xl mb-3 md:mb-4">Verified Security</h3>
                <p className="text-sm sm:text-base text-secondary/80 leading-relaxed">
                  Secure login via OTP and Aadhar verification ensures that every donor and receiver is a verified citizen, creating a trust-based ecosystem.
                </p>
              </div>
              <div className="bg-pastelpeach p-6 sm:p-8 md:p-10 rounded-sm">
                <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4 md:mb-6" />
                <h3 className="font-heading text-xl sm:text-2xl mb-3 md:mb-4">Real-time Tracking</h3>
                <p className="text-sm sm:text-base text-secondary/80 leading-relaxed">
                  From donation to transfusion, track the journey of every unit. Hospitals update stock levels instantly, ensuring transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC FEATURES SCROLL - "Magazine Style" */}
      <section className="bg-secondary text-primary-foreground py-16 md:py-32 overflow-hidden">
        <div className="max-w-[120rem] mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="mb-12 md:mb-24 border-b border-primary-foreground/20 pb-6 md:pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl">The Ecosystem</h2>
            <p className="text-primary-foreground/70 max-w-md text-base md:text-lg md:text-right">
              A comprehensive suite of tools designed for speed, reliability, and saving lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-primary-foreground/10 border border-primary-foreground/10">
            {[
              {
                icon: Bell,
                title: "SOS Alert System",
                desc: "Emergency broadcast to all nearby eligible donors when critical blood is needed.",
                bg: "bg-secondary"
              },
              {
                icon: MapPin,
                title: "Local Availability",
                desc: "Search blood stock by group and area. Find the nearest hospital with available units instantly.",
                bg: "bg-secondary"
              },
              {
                icon: Award,
                title: "Donor Badges",
                desc: "Earn recognition for your contributions. Track your impact and inspire others.",
                bg: "bg-secondary"
              },
              {
                icon: Users,
                title: "Public Portal",
                desc: "Unified dashboard for Donors and Receivers to manage requests and history.",
                bg: "bg-secondary"
              },
              {
                icon: Hospital,
                title: "Hospital Network",
                desc: "Authorized access for hospitals to manage inventory and respond to emergency requests.",
                bg: "bg-secondary"
              },
              {
                icon: Heart,
                title: "Health Monitoring",
                desc: "Smart alerts for donation eligibility (3-month rule) and age verification.",
                bg: "bg-secondary"
              }
            ].map((feature, idx) => (
              <FeatureCard key={idx} {...feature} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - Sticky Layout */}
      <section className="py-16 md:py-32 bg-pastelbeige/30">
        <div className="max-w-[120rem] mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
            {/* Sticky Left Side */}
            <div className="h-fit lg:sticky lg:top-32">
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-secondary mb-6 md:mb-8">
                How It Works
              </h2>
              <p className="text-lg md:text-xl text-secondary/70 mb-8 md:mb-12 max-w-md">
                Three simple steps to become a hero. Whether you are giving or receiving, the process is seamless.
              </p>
              <div className="hidden lg:block">
                <Link to="/public-registration">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 md:h-14 px-6 md:px-8 text-base md:text-lg rounded-full">
                    Start Registration
                  </Button>
                </Link>
              </div>
            </div>

            {/* Scrollable Right Side */}
            <div className="flex flex-col gap-12 md:gap-24">
              <StepCard
                number="01"
                title="Register & Verify"
                desc="Sign up using your Mobile Number and Aadhar Card. Secure OTP verification ensures a trusted community of real people."
                image="https://static.wixstatic.com/media/cea3b9_c3720e2b2d5747df800ca045a7d78ce9~mv2.png?originWidth=768&originHeight=576"
              />
              <StepCard
                number="02"
                title="Connect or Request"
                desc="Donors can view requests nearby. Receivers can send SOS alerts specifying blood group, patient age, and units needed."
                image="https://static.wixstatic.com/media/cea3b9_9f2c379f01e340b1b60fb06b2be11af0~mv2.png?originWidth=768&originHeight=576"
              />
              <StepCard
                number="03"
                title="Save a Life"
                desc="Visit the hospital to donate. The hospital updates the records, and you receive a notification and a badge update."
                image="https://static.wixstatic.com/media/cea3b9_44b167d20e684954882415895eca781c~mv2.png?originWidth=768&originHeight=576"
              />
            </div>
          </div>
        </div>
      </section>

      {/* LARGE IMAGE BREAK - "Visual Breather" */}
      <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://static.wixstatic.com/media/cea3b9_b76a3c27c9ab4c839726ee5eb42cebc9~mv2.png?originWidth=1920&originHeight=704"
            alt="Hope and care"
            className="w-full h-full object-cover"
            width={1920}
          />
          <div className="absolute inset-0 bg-secondary/40 mix-blend-multiply" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-center px-4 sm:px-6">
          <div className="max-w-4xl">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white mb-4 md:mb-6 drop-shadow-lg">
              "रक्तदान - जीवनदान"
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light">
              Every drop counts. Every donor is a hero.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 md:py-32 bg-background">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="bg-secondary rounded-[2rem] p-8 sm:p-12 md:p-24 text-center relative overflow-hidden">
            {/* Decorative Circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-primary-foreground mb-6 md:mb-8">
                Ready to make a difference?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-primary-foreground/80 mb-8 md:mb-12 leading-relaxed">
                Join thousands of donors and hospitals in India's most efficient blood donation network.
                Register today and be the reason someone smiles tomorrow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <Link to="/public-registration">
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 text-base md:text-lg rounded-xl font-semibold shadow-lg shadow-primary/20">
                    Register as Public User
                  </Button>
                </Link>
                <Link to="/hospital-registration">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-secondary h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 text-base md:text-lg rounded-xl font-semibold bg-transparent">
                    Hospital Registration
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// --- Subcomponents for cleaner code ---

function FeatureCard({ icon: Icon, title, desc, bg, index }: { icon: any, title: string, desc: string, bg: string, index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`${bg} group p-6 sm:p-8 md:p-10 lg:p-14 relative overflow-hidden hover:bg-secondary/95 transition-colors duration-500`}
    >
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
        <Icon className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-primary" />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary mb-4 md:mb-6" />
          <h3 className="font-heading text-lg sm:text-xl md:text-2xl lg:text-3xl mb-3 md:mb-4 text-primary-foreground">{title}</h3>
          <p className="text-xs sm:text-sm md:text-base text-primary-foreground/60 leading-relaxed">{desc}</p>
        </div>
        <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-primary-foreground/10 flex items-center text-primary text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          Learn More <ChevronRight className="w-3 h-3 md:w-4 md:h-4 ml-1" />
        </div>
      </div>
    </motion.div>
  );
}

function StepCard({ number, title, desc, image }: { number: string, title: string, desc: string, image: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="group"
    >
      <div className="flex items-baseline gap-3 sm:gap-4 mb-4 md:mb-6">
        <span className="font-heading text-4xl sm:text-5xl md:text-6xl text-primary/20 group-hover:text-primary transition-colors duration-500">{number}</span>
        <h3 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl text-secondary">{title}</h3>
      </div>
      <p className="text-base sm:text-lg text-secondary/70 mb-6 md:mb-8 leading-relaxed max-w-xl">
        {desc}
      </p>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm">
        <div className="absolute inset-0 bg-secondary/10 z-10 group-hover:bg-transparent transition-colors duration-500" />
        <Image
          src={image}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          width={800}
        />
      </div>
    </motion.div>
  );
}
