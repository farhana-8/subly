import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  CreditCard, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight,
  Bell,
  RefreshCw,
  TrendingUp,
  Users,
  Search,
  Settings,
  MoreVertical
} from 'lucide-react';

const DashboardPreview = () => {
  return (
    <div className="w-full h-full bg-bg-deep rounded-xl overflow-hidden flex flex-col md:flex-row relative">
      {/* Sidebar Mock */}
      <div className="hidden md:flex w-20 lg:w-64 border-r border-main flex-col p-4 gap-8 bg-bg-card/50">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-primary-violet flex items-center justify-center text-white font-black">S</div>
          <span className="font-black text-main hidden lg:block">SUBLY</span>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { icon: BarChart3, label: 'Overview', active: true },
            { icon: Zap, label: 'Subscriptions', active: false },
            { icon: Users, label: 'Customers', active: false },
            { icon: CreditCard, label: 'Payments', active: false },
            { icon: Bell, label: 'Notifications', active: false },
            { icon: Settings, label: 'Settings', active: false },
          ].map((item, i) => (
            <div 
              key={i} 
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${item.active ? 'bg-primary-violet text-white shadow-lg shadow-primary-violet/20' : 'text-muted hover:bg-main/5'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-bold text-sm hidden lg:block">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Mock */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Mock */}
        <div className="h-16 border-b border-main flex items-center justify-between px-6 bg-bg-card/30">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-xs hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <div className="w-full h-9 bg-bg-deep border border-main rounded-lg px-10 text-xs text-muted flex items-center">Search analytics...</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-bg-deep border border-main flex items-center justify-center relative">
              <Bell className="w-4 h-4 text-muted" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary-magenta rounded-full border-2 border-bg-card"></span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-violet to-primary-magenta border border-white/20"></div>
          </div>
        </div>

        {/* Dashboard Content Mock */}
        <div className="flex-1 p-6 overflow-hidden space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total MRR', value: '$42,500', trend: '+12.5%', color: 'text-accent-lime' },
              { label: 'Active Subs', value: '1,284', trend: '+5.2%', color: 'text-primary-violet' },
              { label: 'Churn Rate', value: '2.4%', trend: '-0.8%', color: 'text-accent-orange' },
            ].map((stat, i) => (
              <div key={i} className="bg-bg-card border border-main rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-muted uppercase tracking-wider">{stat.label}</span>
                  <TrendingUp className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-main">{stat.value}</span>
                  <span className={`text-[10px] font-black ${stat.color}`}>{stat.trend}</span>
                </div>
                <div className="w-full h-1 bg-main/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    transition={{ delay: 1 + (i * 0.2), duration: 1 }}
                    className={`h-full bg-gradient-to-r ${i === 0 ? 'from-accent-lime to-emerald-500' : i === 1 ? 'from-primary-violet to-primary-purple' : 'from-accent-orange to-accent-coral'}`}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>

          {/* Table Mock */}
          <div className="bg-bg-card border border-main rounded-2xl overflow-hidden flex-1 flex flex-col">
            <div className="px-4 py-3 border-b border-main flex justify-between items-center">
              <span className="text-xs font-black text-main uppercase tracking-wider">Recent Transactions</span>
              <MoreVertical className="w-4 h-4 text-muted" />
            </div>
            <div className="flex-1 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-main bg-main/[0.02]">
                    <th className="px-4 py-2 text-[10px] font-black text-muted uppercase">Customer</th>
                    <th className="px-4 py-2 text-[10px] font-black text-muted uppercase">Plan</th>
                    <th className="px-4 py-2 text-[10px] font-black text-muted uppercase">Status</th>
                    <th className="px-4 py-2 text-[10px] font-black text-muted uppercase text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-main/5">
                  {[
                    { name: 'Alex Rivera', plan: 'Pro Monthly', status: 'Success', amount: '$29.00' },
                    { name: 'Sarah Chen', plan: 'Enterprise', status: 'Success', amount: '$499.00' },
                    { name: 'Mike Johnson', plan: 'Pro Yearly', status: 'Pending', amount: '$290.00' },
                    { name: 'Emma Wilson', plan: 'Basic', status: 'Success', amount: '$9.00' },
                  ].map((row, i) => (
                    <tr key={i} className="group hover:bg-main/[0.01] transition-colors">
                      <td className="px-4 py-3 text-xs font-bold text-main">{row.name}</td>
                      <td className="px-4 py-3 text-[10px] text-muted font-bold">{row.plan}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${row.status === 'Success' ? 'bg-accent-lime/10 text-accent-lime' : 'bg-accent-orange/10 text-accent-orange'}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-black text-main text-right">{row.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Badge Mock */}
      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 -right-4 bg-bg-card border border-main p-4 rounded-2xl shadow-2xl z-20 hidden lg:block"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-lime/20 flex items-center justify-center text-accent-lime">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-black text-main">Revenue Milestone</div>
            <div className="text-[10px] text-muted font-bold">You hit $40k MRR! 🚀</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
    { 
      name: 'Subscription Management', 
      desc: 'Complete lifecycle control from trial to cancellation.',
      icon: Zap,
      color: 'from-primary-violet to-primary-purple'
    },
    { 
      name: 'Automated Billing', 
      desc: 'Generate professional invoices and process recurring payments.',
      icon: CreditCard,
      color: 'from-primary-magenta to-accent-coral'
    },
    { 
      name: 'Razorpay Integration', 
      desc: 'Seamless, secure payments with full Razorpay support.',
      icon: Shield,
      color: 'from-accent-cyan to-primary-violet'
    },
    { 
      name: 'Renewal Processing', 
      desc: 'Smart logic to handle failed payments and retries.',
      icon: RefreshCw,
      color: 'from-accent-orange to-accent-coral'
    },
    { 
      name: 'Real-time Notifications', 
      desc: 'Keep users informed with automated email updates.',
      icon: Bell,
      color: 'from-accent-lime to-emerald-500'
    },
    { 
      name: 'Admin Analytics', 
      desc: 'Deep insights into your MRR, churn, and LTV.',
      icon: BarChart3,
      color: 'from-primary-purple to-primary-magenta'
    }
  ];

  return (
    <div className="relative overflow-hidden bg-bg-deep transition-colors duration-300">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none overflow-hidden opacity-20 dark:opacity-20 light:opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-violet rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-primary-magenta rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center px-4 py-1.5 rounded-full bg-bg-card border border-main text-primary-violet text-sm font-bold mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary-violet mr-2 animate-ping"></span>
            Enterprise Billing Infrastructure
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-main mb-8 leading-[1.1]">
            Subscription billing, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-violet via-primary-magenta to-accent-coral">
              without the complexity.
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg md:text-xl text-muted mb-12 leading-relaxed">
            Automate your billing, manage subscriptions, and scale your SaaS with Subly's robust, enterprise-grade infrastructure.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-primary-violet text-white rounded-full font-bold text-lg hover:bg-primary-purple transition-all shadow-lg hover:shadow-primary-violet/30 hover:scale-105 active:scale-95"
            >
              Get Started Free
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-bg-card text-main border border-main rounded-full font-bold text-lg hover:bg-main/5 transition-all flex items-center justify-center group"
            >
              Explore Plans
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Premium Dashboard Preview */}
          <motion.div 
            variants={itemVariants}
            className="mt-20 relative mx-auto max-w-5xl rounded-2xl border border-main bg-bg-dark/50 p-2 backdrop-blur-sm shadow-2xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-violet/10 via-transparent to-primary-magenta/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="rounded-xl border border-main overflow-hidden bg-bg-deep aspect-[16/10] md:aspect-[16/9] flex relative shadow-inner">
              <DashboardPreview />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Strip */}
      <section className="py-12 border-y border-main bg-main/[0.02]">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-70">
            {['Secure Payments', 'Automated Renewals', 'Smart Subscriptions', 'Real-time Updates'].map((text) => (
              <div key={text} className="flex items-center text-sm font-bold tracking-widest uppercase text-main">
                <CheckCircle2 className="h-4 w-4 mr-2 text-primary-violet" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-primary-violet font-bold text-sm uppercase tracking-widest mb-4">Capabilities</h2>
            <p className="text-4xl md:text-5xl font-black text-main">Built for modern SaaS.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div 
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="group p-8 rounded-3xl bg-bg-card border border-main hover:border-primary-violet/30 transition-all shadow-sm"
              >
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 shadow-lg`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-main mb-3">{feature.name}</h3>
                <p className="text-muted leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32 bg-bg-dark/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-main mb-20">Simple integration.</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-primary-violet via-primary-magenta to-accent-coral opacity-20"></div>
            
            {[
              { step: '01', title: 'Choose a plan', desc: 'Select the perfect tier for your needs.' },
              { step: '02', title: 'Subscribe', desc: 'Instant access to our billing API.' },
              { step: '03', title: 'Pay securely', desc: 'Industry-standard payment processing.' },
              { step: '04', title: 'Manage', desc: 'Full control via your dashboard.' }
            ].map((item, idx) => (
              <div key={item.step} className="relative z-10">
                <div className="w-24 h-24 rounded-full bg-bg-card border border-main flex items-center justify-center mx-auto mb-8 shadow-xl group hover:border-primary-violet transition-colors">
                  <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary-violet to-primary-magenta">
                    {item.step}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-main mb-2">{item.title}</h4>
                <p className="text-muted text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-primary-violet via-primary-purple to-bg-deep p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready to scale your SaaS?</h2>
            <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
              Join hundreds of companies using Subly to manage their subscription infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/register" 
                className="w-full sm:w-auto px-10 py-5 bg-white text-primary-purple rounded-full font-black text-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105"
              >
                Start Free Trial
              </Link>
              <Link 
                to="/login" 
                className="w-full sm:w-auto px-10 py-5 bg-transparent text-white border-2 border-white/20 rounded-full font-black text-lg hover:bg-white/10 transition-all"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
