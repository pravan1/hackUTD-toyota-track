import { useState, useEffect } from 'react'
import { AlertTriangle, Check } from 'lucide-react'
import Modal from './ui/Modal'
import Input from './ui/Input'
import Select from './ui/Select'
import Button from './ui/Button'
import Badge from './ui/Badge'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

const GEMINI_MODELS = [
  { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Fast)' },
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Advanced)' },
  { value: 'gemini-pro', label: 'Gemini Pro (Legacy)' },
]

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('')
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load from localStorage
    const storedKey = localStorage.getItem('GEMINI_API_KEY')
    const storedModel = localStorage.getItem('GEMINI_MODEL')

    if (storedKey) setApiKey(storedKey)
    if (storedModel) setSelectedModel(storedModel)
  }, [isOpen])

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('GEMINI_API_KEY', apiKey.trim())
      localStorage.setItem('GEMINI_MODEL', selectedModel)
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        onClose()
      }, 1500)
    } else {
      localStorage.removeItem('GEMINI_API_KEY')
      localStorage.removeItem('GEMINI_MODEL')
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        onClose()
      }, 1500)
    }
  }

  const handleClear = () => {
    setApiKey('')
    localStorage.removeItem('GEMINI_API_KEY')
    localStorage.removeItem('GEMINI_MODEL')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chatbot Settings" size="md">
      <div className="space-y-6">
        {/* Warning Banner */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900 mb-1">Security Warning</h4>
            <p className="text-sm text-red-800">
              Your API key will be stored in your browser's localStorage and sent directly
              to Google's Gemini API. Never share your API key with others. For production
              applications, API keys should be stored securely on the server.
            </p>
          </div>
        </div>

        {/* Current Mode */}
        <div>
          <label className="text-sm font-medium text-toyota-black mb-2 block">
            Current Mode
          </label>
          <Badge variant={apiKey ? 'success' : 'default'} size="md">
            {apiKey ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Gemini AI Enabled
              </>
            ) : (
              'MOCK Mode (Rule-based responses)'
            )}
          </Badge>
        </div>

        {/* API Key Input */}
        <Input
          label="Gemini API Key"
          type="password"
          placeholder="Enter your Gemini API key (optional)"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />

        {/* Model Selection */}
        <Select
          label="Model"
          options={GEMINI_MODELS}
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={!apiKey}
        />

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">How to get an API key:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
            <li>Sign in with your Google account</li>
            <li>Click "Get API Key" or "Create API Key"</li>
            <li>Copy your API key and paste it above</li>
          </ol>
          <p className="text-sm text-blue-800 mt-3">
            <strong>Note:</strong> Leaving the API key blank will use MOCK mode with pre-programmed
            responses instead of AI.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} fullWidth disabled={saved}>
            {saved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
          {apiKey && (
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
