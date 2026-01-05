'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { InlineWidget } from 'react-calendly'
import { FaCalendarAlt, FaClock, FaVideo } from 'react-icons/fa'

// Update this with your Calendly username/event link
const CALENDLY_URL = 'https://calendly.com/arunsunderraj'

export default function BookingSection() {
  const [showCalendar, setShowCalendar] = useState(false)

  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Schedule a Call
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-accent-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Want to discuss a project, collaboration, or just have a chat? Book a time that works for you.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Features/Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
              <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaClock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">30 Min Sessions</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Quick, focused conversations to discuss your needs
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
              <div className="w-14 h-14 bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaVideo className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Video Calls</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Face-to-face conversations via Google Meet or Zoom
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
              <div className="w-14 h-14 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Choose a time that works best for your timezone
              </p>
            </div>
          </motion.div>

          {/* Calendly Widget */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
          >
            {showCalendar ? (
              <div className="min-h-[600px]">
                <InlineWidget
                  url={CALENDLY_URL}
                  styles={{
                    height: '600px',
                    minWidth: '320px',
                  }}
                  pageSettings={{
                    backgroundColor: 'ffffff',
                    hideEventTypeDetails: false,
                    hideLandingPageDetails: false,
                    primaryColor: '0284c7',
                    textColor: '374151',
                  }}
                />
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCalendarAlt className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Ready to Connect?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Click the button below to view my available times and book a meeting directly in your calendar.
                </p>
                <button
                  onClick={() => setShowCalendar(true)}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <FaCalendarAlt className="mr-3" />
                  View Available Times
                </button>
              </div>
            )}
          </motion.div>

          {/* Alternative: Use popup modal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-8"
          >
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Or reach out via the{' '}
              <a href="#contact" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                contact form below
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

