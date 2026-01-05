'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaStar, FaCodeBranch, FaUsers, FaCode, FaExternalLinkAlt } from 'react-icons/fa'

interface GitHubData {
  user: {
    login: string
    name: string
    avatarUrl: string
    profileUrl: string
    publicRepos: number
    followers: number
    following: number
    bio: string | null
  }
  repos: Array<{
    name: string
    description: string | null
    url: string
    stars: number
    forks: number
    language: string | null
    updatedAt: string
  }>
  stats: {
    totalStars: number
    totalForks: number
    topLanguages: Array<{ language: string; count: number }>
  }
}

const languageColors: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Shell: '#89e051',
  Vue: '#41b883',
  React: '#61dafb',
}

export default function GitHubStats() {
  const [data, setData] = useState<GitHubData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/github')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((data) => {
        setData(data)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <section id="github" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error || !data) {
    return null // Silently fail - don't show section if GitHub data unavailable
  }

  return (
    <section id="github" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            GitHub Activity
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-accent-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            My open source contributions and projects
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
              <FaCode className="w-8 h-8 mx-auto mb-2 text-primary-600 dark:text-primary-400" />
              <div className="text-3xl font-bold text-gray-800 dark:text-white">{data.user.publicRepos}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Repositories</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
              <FaStar className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-3xl font-bold text-gray-800 dark:text-white">{data.stats.totalStars}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Total Stars</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
              <FaCodeBranch className="w-8 h-8 mx-auto mb-2 text-accent-600 dark:text-accent-400" />
              <div className="text-3xl font-bold text-gray-800 dark:text-white">{data.stats.totalForks}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Total Forks</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
              <FaUsers className="w-8 h-8 mx-auto mb-2 text-secondary-600 dark:text-secondary-400" />
              <div className="text-3xl font-bold text-gray-800 dark:text-white">{data.user.followers}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Followers</div>
            </div>
          </motion.div>

          {/* Top Languages */}
          {data.stats.topLanguages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Top Languages</h3>
              <div className="flex flex-wrap gap-3">
                {data.stats.topLanguages.map(({ language, count }) => (
                  <div
                    key={language}
                    className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full"
                  >
                    <span
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: languageColors[language] || '#6b7280' }}
                    />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{language}</span>
                    <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">({count})</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recent Repositories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Repositories</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.repos.slice(0, 6).map((repo, index) => (
                <motion.a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                      {repo.name}
                    </h4>
                    <FaExternalLinkAlt className="w-3 h-3 text-gray-400 group-hover:text-primary-600 flex-shrink-0 ml-2" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {repo.description || 'No description'}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    {repo.language && (
                      <div className="flex items-center">
                        <span
                          className="w-2.5 h-2.5 rounded-full mr-1.5"
                          style={{ backgroundColor: languageColors[repo.language] || '#6b7280' }}
                        />
                        <span className="text-gray-600 dark:text-gray-400">{repo.language}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <FaStar className="w-3 h-3 mr-1" />
                        {repo.stars}
                      </div>
                      <div className="flex items-center">
                        <FaCodeBranch className="w-3 h-3 mr-1" />
                        {repo.forks}
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* View Profile Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-8"
          >
            <a
              href={data.user.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
            >
              <FaGithub className="mr-2" />
              View Full Profile
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

