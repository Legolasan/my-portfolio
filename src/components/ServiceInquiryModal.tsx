'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaArrowRight, FaArrowLeft, FaCheck, FaSpinner } from 'react-icons/fa'
import emailjs from '@emailjs/browser'
import type { ServiceType } from '@/app/services/page'

interface ServiceInquiryModalProps {
  isOpen: boolean
  onClose: () => void
  serviceType: ServiceType | null
}

interface FormData {
  // Common fields
  name: string
  email: string
  phone: string
  // Website fields
  businessType: string
  projectDescription: string
  budgetRange: string
  timeline: string
  features: string[]
  referenceWebsites: string
  // Tool fields
  problemToSolve: string
  targetPlatforms: string[]
  integrationsNeeded: string
  expectedUsers: string
  currentWorkflow: string
  dataSources: string
  securityRequirements: string[]
  // ETL fields
  sourceSystems: string
  destinationSystems: string
  dataVolume: string
  syncFrequency: string
  transformationsNeeded: string
  currentSetup: string
  complianceRequirements: string[]
  errorHandling: string
  supportLevel: string
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  businessType: '',
  projectDescription: '',
  budgetRange: '',
  timeline: '',
  features: [],
  referenceWebsites: '',
  problemToSolve: '',
  targetPlatforms: [],
  integrationsNeeded: '',
  expectedUsers: '',
  currentWorkflow: '',
  dataSources: '',
  securityRequirements: [],
  sourceSystems: '',
  destinationSystems: '',
  dataVolume: '',
  syncFrequency: '',
  transformationsNeeded: '',
  currentSetup: '',
  complianceRequirements: [],
  errorHandling: '',
  supportLevel: '',
}

const serviceConfig = {
  website: {
    title: 'Website Building',
    gradient: 'from-blue-500 to-cyan-500',
  },
  tool: {
    title: 'Tool Building',
    gradient: 'from-purple-500 to-pink-500',
  },
  etl: {
    title: 'ETL Integration',
    gradient: 'from-orange-500 to-red-500',
  },
}

export default function ServiceInquiryModal({ isOpen, onClose, serviceType }: ServiceInquiryModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  // Reset form when modal opens/closes or service changes
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setFormData(initialFormData)
      setSubmitStatus('idle')
      setErrorMessage('')
    }
  }, [isOpen, serviceType])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const currentValues = prev[field] as string[]
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
      return { ...prev, [field]: newValues }
    })
  }

  const formatFormDataForEmail = (): string => {
    const config = serviceType ? serviceConfig[serviceType] : null
    let message = `Service Inquiry: ${config?.title || 'Unknown'}\n\n`
    message += `--- Contact Information ---\n`
    message += `Name: ${formData.name}\n`
    message += `Email: ${formData.email}\n`
    message += `Phone: ${formData.phone || 'Not provided'}\n\n`

    if (serviceType === 'website') {
      message += `--- Website Building Details ---\n`
      message += `Business Type: ${formData.businessType}\n`
      message += `Project Description: ${formData.projectDescription}\n`
      message += `Budget Range: ${formData.budgetRange}\n`
      message += `Timeline: ${formData.timeline}\n`
      message += `Features Needed: ${formData.features.join(', ') || 'None selected'}\n`
      message += `Reference Websites: ${formData.referenceWebsites || 'None provided'}\n`
    } else if (serviceType === 'tool') {
      message += `--- Tool Building Details ---\n`
      message += `Problem to Solve: ${formData.problemToSolve}\n`
      message += `Target Platforms: ${formData.targetPlatforms.join(', ') || 'None selected'}\n`
      message += `Integrations Needed: ${formData.integrationsNeeded || 'None specified'}\n`
      message += `Expected Users: ${formData.expectedUsers}\n`
      message += `Budget Range: ${formData.budgetRange}\n`
      message += `Timeline: ${formData.timeline}\n`
      message += `Current Workflow: ${formData.currentWorkflow || 'Not described'}\n`
      message += `Data Sources: ${formData.dataSources || 'None specified'}\n`
      message += `Security Requirements: ${formData.securityRequirements.join(', ') || 'None selected'}\n`
    } else if (serviceType === 'etl') {
      message += `--- ETL Integration Details ---\n`
      message += `Source Systems: ${formData.sourceSystems}\n`
      message += `Destination Systems: ${formData.destinationSystems}\n`
      message += `Data Volume: ${formData.dataVolume}\n`
      message += `Sync Frequency: ${formData.syncFrequency}\n`
      message += `Transformations Needed: ${formData.transformationsNeeded || 'None specified'}\n`
      message += `Current Setup: ${formData.currentSetup || 'Not described'}\n`
      message += `Compliance Requirements: ${formData.complianceRequirements.join(', ') || 'None selected'}\n`
      message += `Error Handling Preference: ${formData.errorHandling}\n`
      message += `Support Level Needed: ${formData.supportLevel}\n`
    }

    return message
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('Email service not configured')
      }

      const config = serviceType ? serviceConfig[serviceType] : null
      
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: `Service Inquiry: ${config?.title || 'General'}`,
          message: formatFormDataForEmail(),
        },
        publicKey
      )

      setSubmitStatus('success')
    } catch (error: any) {
      console.error('EmailJS error:', error)
      setSubmitStatus('error')
      setErrorMessage(error?.text || error?.message || 'Failed to send inquiry')
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceed = () => {
    if (step === 1) {
      return formData.name.trim() && formData.email.trim()
    }
    if (step === 2) {
      if (serviceType === 'website') {
        return formData.businessType && formData.projectDescription.trim()
      }
      if (serviceType === 'tool') {
        return formData.problemToSolve.trim() && formData.targetPlatforms.length > 0
      }
      if (serviceType === 'etl') {
        return formData.sourceSystems.trim() && formData.destinationSystems.trim()
      }
    }
    return true
  }

  const totalSteps = 3
  const config = serviceType ? serviceConfig[serviceType] : null

  if (!isOpen || !serviceType) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className={`p-6 bg-gradient-to-r ${config?.gradient} text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{config?.title}</h2>
                <p className="text-white/80 text-sm mt-1">Tell us about your project</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Progress Bar */}
            {submitStatus === 'idle' && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-white/80 mb-2">
                  <span>Step {step} of {totalSteps}</span>
                  <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / totalSteps) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {submitStatus === 'success' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="text-green-600 dark:text-green-400" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Inquiry Sent Successfully!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Thank you for your interest. I'll review your requirements and get back to you within 24-48 hours.
                </p>
                <button
                  onClick={onClose}
                  className={`px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${config?.gradient}`}
                >
                  Close
                </button>
              </motion.div>
            ) : submitStatus === 'error' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTimes className="text-red-600 dark:text-red-400" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Something Went Wrong
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {errorMessage || 'Failed to send your inquiry. Please try again or email directly.'}
                </p>
                <button
                  onClick={() => setSubmitStatus('idle')}
                  className={`px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${config?.gradient}`}
                >
                  Try Again
                </button>
              </motion.div>
            ) : (
              <form ref={formRef}>
                <AnimatePresence mode="wait">
                  {/* Step 1: Contact Information */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Contact Information
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                          placeholder="Your full name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Phone <span className="text-gray-400">(optional)</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Service-Specific Details */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      {serviceType === 'website' && <WebsiteFields formData={formData} onChange={handleInputChange} onCheckboxChange={handleCheckboxChange} />}
                      {serviceType === 'tool' && <ToolFields formData={formData} onChange={handleInputChange} onCheckboxChange={handleCheckboxChange} />}
                      {serviceType === 'etl' && <ETLFieldsStep1 formData={formData} onChange={handleInputChange} />}
                    </motion.div>
                  )}

                  {/* Step 3: Additional Details */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      {serviceType === 'website' && <WebsiteFieldsStep2 formData={formData} onChange={handleInputChange} />}
                      {serviceType === 'tool' && <ToolFieldsStep2 formData={formData} onChange={handleInputChange} onCheckboxChange={handleCheckboxChange} />}
                      {serviceType === 'etl' && <ETLFieldsStep2 formData={formData} onChange={handleInputChange} onCheckboxChange={handleCheckboxChange} />}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            )}
          </div>

          {/* Footer */}
          {submitStatus === 'idle' && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <button
                onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium flex items-center"
              >
                <FaArrowLeft className="mr-2" />
                {step > 1 ? 'Back' : 'Cancel'}
              </button>

              {step < totalSteps ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className={`px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${config?.gradient} flex items-center disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Next
                  <FaArrowRight className="ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${config?.gradient} flex items-center disabled:opacity-50`}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Submit Inquiry
                      <FaCheck className="ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// Website Building Fields
function WebsiteFields({ formData, onChange, onCheckboxChange }: { formData: FormData; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; onCheckboxChange: (field: keyof FormData, value: string) => void }) {
  const featureOptions = ['E-commerce', 'Blog/CMS', 'User Authentication', 'Admin Dashboard', 'Payment Integration', 'Booking System', 'Contact Forms', 'SEO Optimization']
  
  return (
    <>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Project Details
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Business/Project Type <span className="text-red-500">*</span>
        </label>
        <select
          name="businessType"
          value={formData.businessType}
          onChange={onChange}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
        >
          <option value="">Select type...</option>
          <option value="portfolio">Portfolio/Personal</option>
          <option value="business">Business/Corporate</option>
          <option value="ecommerce">E-commerce/Online Store</option>
          <option value="saas">SaaS/Web Application</option>
          <option value="blog">Blog/Content Site</option>
          <option value="landing">Landing Page</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Project Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="projectDescription"
          value={formData.projectDescription}
          onChange={onChange}
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
          placeholder="Describe your project and goals..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Features Needed
        </label>
        <div className="grid grid-cols-2 gap-2">
          {featureOptions.map(feature => (
            <label key={feature} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.features.includes(feature)}
                onChange={() => onCheckboxChange('features', feature)}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  )
}

function WebsiteFieldsStep2({ formData, onChange }: { formData: FormData; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void }) {
  return (
    <>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Budget & Timeline
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Budget Range
        </label>
        <select
          name="budgetRange"
          value={formData.budgetRange}
          onChange={onChange}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
        >
          <option value="">Select budget...</option>
          <option value="<1k">Less than $1,000</option>
          <option value="1k-5k">$1,000 - $5,000</option>
          <option value="5k-10k">$5,000 - $10,000</option>
          <option value="10k+">$10,000+</option>
          <option value="flexible">Flexible/Discuss</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Timeline
        </label>
        <select
          name="timeline"
          value={formData.timeline}
          onChange={onChange}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
        >
          <option value="">Select timeline...</option>
          <option value="asap">ASAP (Rush)</option>
          <option value="1-2months">1-2 Months</option>
          <option value="3+months">3+ Months</option>
          <option value="flexible">Flexible</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Reference Websites
        </label>
        <textarea
          name="referenceWebsites"
          value={formData.referenceWebsites}
          onChange={onChange}
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
          placeholder="Share links to websites you like (design, features, etc.)..."
        />
      </div>
    </>
  )
}

// Tool Building Fields
function ToolFields({ formData, onChange, onCheckboxChange }: { formData: FormData; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; onCheckboxChange: (field: keyof FormData, value: string) => void }) {
  const platformOptions = ['Web Application', 'Mobile App', 'Desktop App', 'API/Backend', 'Browser Extension', 'CLI Tool']
  
  return (
    <>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Tool Requirements
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Problem to Solve <span className="text-red-500">*</span>
        </label>
        <textarea
          name="problemToSolve"
          value={formData.problemToSolve}
          onChange={onChange}
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
          placeholder="What problem should this tool solve? Describe your use case..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Target Platforms <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {platformOptions.map(platform => (
            <label key={platform} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.targetPlatforms.includes(platform)}
                onChange={() => onCheckboxChange('targetPlatforms', platform)}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{platform}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Integrations Needed
        </label>
        <textarea
          name="integrationsNeeded"
          value={formData.integrationsNeeded}
          onChange={onChange}
          rows={2}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
          placeholder="Any specific tools or services to integrate with..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Expected Users
        </label>
        <select
          name="expectedUsers"
          value={formData.expectedUsers}
          onChange={onChange}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
        >
          <option value="">Select user count...</option>
          <option value="1-10">1-10 users (Personal/Team)</option>
          <option value="10-100">10-100 users (Small Business)</option>
          <option value="100-1000">100-1000 users (Medium)</option>
          <option value="1000+">1000+ users (Enterprise)</option>
        </select>
      </div>
    </>
  )
}

function ToolFieldsStep2({ formData, onChange, onCheckboxChange }: { formData: FormData; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; onCheckboxChange: (field: keyof FormData, value: string) => void }) {
  const securityOptions = ['User Authentication', 'Role-based Access', 'Data Encryption', 'Audit Logging', 'GDPR Compliance', 'SSO Integration']
  
  return (
    <>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Additional Details
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Budget Range
          </label>
          <select
            name="budgetRange"
            value={formData.budgetRange}
            onChange={onChange}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          >
            <option value="">Select...</option>
            <option value="<1k">Less than $1,000</option>
            <option value="1k-5k">$1,000 - $5,000</option>
            <option value="5k-10k">$5,000 - $10,000</option>
            <option value="10k+">$10,000+</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Timeline
          </label>
          <select
            name="timeline"
            value={formData.timeline}
            onChange={onChange}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          >
            <option value="">Select...</option>
            <option value="asap">ASAP</option>
            <option value="1-2months">1-2 Months</option>
            <option value="3+months">3+ Months</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Current Workflow
        </label>
        <textarea
          name="currentWorkflow"
          value={formData.currentWorkflow}
          onChange={onChange}
          rows={2}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
          placeholder="How do you currently handle this task/process?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Data Sources
        </label>
        <textarea
          name="dataSources"
          value={formData.dataSources}
          onChange={onChange}
          rows={2}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
          placeholder="What data sources will the tool need to work with?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Security Requirements
        </label>
        <div className="grid grid-cols-2 gap-2">
          {securityOptions.map(option => (
            <label key={option} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.securityRequirements.includes(option)}
                onChange={() => onCheckboxChange('securityRequirements', option)}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  )
}

// ETL Integration Fields
function ETLFieldsStep1({ formData, onChange }: { formData: FormData; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void }) {
  return (
    <>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Data Pipeline Details
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Source Systems <span className="text-red-500">*</span>
        </label>
        <textarea
          name="sourceSystems"
          value={formData.sourceSystems}
          onChange={onChange}
          rows={2}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
          placeholder="e.g., Salesforce, MySQL, REST APIs, Google Sheets..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Destination Systems <span className="text-red-500">*</span>
        </label>
        <textarea
          name="destinationSystems"
          value={formData.destinationSystems}
          onChange={onChange}
          rows={2}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
          placeholder="e.g., Snowflake, BigQuery, PostgreSQL, Data Lake..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Data Volume Estimate
          </label>
          <select
            name="dataVolume"
            value={formData.dataVolume}
            onChange={onChange}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          >
            <option value="">Select...</option>
            <option value="<1gb">Less than 1 GB</option>
            <option value="1-10gb">1-10 GB</option>
            <option value="10-100gb">10-100 GB</option>
            <option value="100gb-1tb">100 GB - 1 TB</option>
            <option value="1tb+">1 TB+</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sync Frequency
          </label>
          <select
            name="syncFrequency"
            value={formData.syncFrequency}
            onChange={onChange}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          >
            <option value="">Select...</option>
            <option value="realtime">Real-time/Streaming</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="on-demand">On-demand</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Transformations Needed
        </label>
        <textarea
          name="transformationsNeeded"
          value={formData.transformationsNeeded}
          onChange={onChange}
          rows={2}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
          placeholder="Any data transformations, mappings, or business logic needed?"
        />
      </div>
    </>
  )
}

function ETLFieldsStep2({ formData, onChange, onCheckboxChange }: { formData: FormData; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; onCheckboxChange: (field: keyof FormData, value: string) => void }) {
  const complianceOptions = ['GDPR', 'HIPAA', 'SOC 2', 'PCI DSS', 'None/Not Sure']
  
  return (
    <>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Configuration & Support
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Current Setup Description
        </label>
        <textarea
          name="currentSetup"
          value={formData.currentSetup}
          onChange={onChange}
          rows={2}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
          placeholder="Describe your current data pipeline setup (if any)..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Compliance Requirements
        </label>
        <div className="grid grid-cols-2 gap-2">
          {complianceOptions.map(option => (
            <label key={option} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.complianceRequirements.includes(option)}
                onChange={() => onCheckboxChange('complianceRequirements', option)}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Error Handling Preference
          </label>
          <select
            name="errorHandling"
            value={formData.errorHandling}
            onChange={onChange}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          >
            <option value="">Select...</option>
            <option value="stop">Stop on Error</option>
            <option value="skip">Skip & Continue</option>
            <option value="retry">Auto-retry</option>
            <option value="quarantine">Quarantine Bad Records</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Support Level Needed
          </label>
          <select
            name="supportLevel"
            value={formData.supportLevel}
            onChange={onChange}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          >
            <option value="">Select...</option>
            <option value="self-service">Self-service (Documentation)</option>
            <option value="email">Email Support</option>
            <option value="priority">Priority Support</option>
            <option value="dedicated">Dedicated Support</option>
          </select>
        </div>
      </div>
    </>
  )
}

