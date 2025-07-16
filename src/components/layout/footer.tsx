"use client";

import { motion } from 'framer-motion';
import { FaGithub, FaHeart, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { useBudget } from '@/contexts/budget-context';
import { ThemeToggle } from '../ui/theme-toggle';

export default function Footer() {
  const { resolvedTheme } = useBudget();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 dark:border-slate-800 py-8 mt-auto">
      {/* Gradient background */}
      <div 
        className="absolute inset-0 -z-10 opacity-5 dark:opacity-10 bg-gradient-angular"
        style={{ backgroundSize: '200% 200%' }}
      ></div>
      
      {/* Mesh grid background */}
      <div 
        className="absolute inset-0 -z-10 bg-gradient-mesh bg-[length:40px_40px]"
      ></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center justify-center md:justify-start gap-2 mb-2"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-primary-500 to-brand-secondary-300 flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xs">BZ</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">BudgetZero</h3>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-sm text-slate-600 dark:text-slate-400"
            >
              A simple budget tracking app to help you manage your finances
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xs text-slate-500 dark:text-slate-500 mt-2 flex items-center justify-center md:justify-start"
            >
              © {currentYear} - Built By EchoSphere
            </motion.p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex items-center space-x-4 mb-4"
            >
              <a
                href="https://github.com/ceciliomichael"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="text-lg" />
              </a>
              
              <a
                href="https://twitter.com/username"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="text-lg" />
              </a>
              
              <a
                href="mailto:contact@example.com"
                className="flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                aria-label="Email"
              >
                <FaEnvelope className="text-lg" />
              </a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <ThemeToggle variant="default" />
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
} 