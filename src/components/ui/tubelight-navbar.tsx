"use client"

import React, { useEffect, useState, type ReactNode } from "react"
import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { LucideIcon, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  rightContent?: ReactNode
}

export function NavBar({ items, className, rightContent }: NavBarProps) {
  const { t } = useTranslation();
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Update active tab based on current route
  useEffect(() => {
    const currentItem = items.find(item => item.url === location.pathname)
    if (currentItem) {
      setActiveTab(currentItem.name)
    }
  }, [location.pathname, items])

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full",
          className,
        )}
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          borderRadius: '0 0 12px 12px'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300 -ml-4 sm:-ml-6 lg:-ml-10"
            >
              <span className="text-xl font-bold font-poppins" style={{ color: '#1a1a1a' }}>
                {t('brand.name')}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {items.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.name

                return (
                  <Link
                    key={item.name}
                    to={item.url}
                    onClick={() => setActiveTab(item.name)}
                    className={cn(
                      "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 font-poppins flex items-center gap-2",
                      isActive 
                        ? "text-pear" 
                        : "hover:text-pear"
                    )}
                    style={{ 
                      color: isActive ? '#7CB342' : '#1a1a1a'
                    }}
                  >
                    <Icon size={16} strokeWidth={2} />
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-lg -z-10"
                        style={{
                          background: 'rgba(124, 179, 66, 0.1)'
                        }}
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right content (e.g., Sign In / Account) */}
            <div className="hidden md:flex items-center ml-3">
              {rightContent}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg transition-colors duration-300"
                style={{ color: '#1a1a1a' }}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-white/20"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(20px)'
            }}
          >
            <div className="px-4 py-3 space-y-1">
              {items.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.name

                return (
                  <Link
                    key={item.name}
                    to={item.url}
                    onClick={() => {
                      setActiveTab(item.name)
                      setMobileMenuOpen(false)
                    }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 font-poppins",
                      isActive 
                        ? "bg-white/20 text-pear" 
                        : "hover:bg-white/10 hover:text-pear"
                    )}
                    style={{ 
                      color: isActive ? '#7CB342' : '#1a1a1a'
                    }}
                  >
                    <Icon size={18} strokeWidth={2} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </nav>
      
      {/* Spacer to prevent content from being hidden under fixed navbar */}
      <div className="h-14" />
    </>
  )
}