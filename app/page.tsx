"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Scan,
  Calendar,
  Gift,
  User,
  Building,
  Mail,
  QrCode,
  Plus,
  Save,
  Trash2,
  CheckCircle,
  Send,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock scanned lead data
const mockLeadData = {
  name: "Alex Thompson",
  title: "VP of Engineering",
  company: "TechCorp Solutions",
  email: "alex.thompson@techcorp.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  interests: ["AI/ML", "Cloud Infrastructure", "DevOps"],
  crmSynced: false,
}

export default function BoothDelight() {
  const [selectedMember, setSelectedMember] = useState("")
  const [showMeetingQR, setShowMeetingQR] = useState(false)
  const [showGiftQR, setShowGiftQR] = useState(false)
  const [showLeadScanner, setShowLeadScanner] = useState(false)
  const [scannedLead, setScannedLead] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [showTeamManager, setShowTeamManager] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [emailType, setEmailType] = useState("") // "meeting" or "gift"
  const [teamMembers, setTeamMembers] = useState([
    {
      id: "1",
      name: "Pinkesh Shah",
      role: "Chief Delight Officer",
      meetingLink: "https://cal.com/pinkesh-shah/30min",
      avatar: "PS",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      role: "Sales Director",
      meetingLink: "https://cal.com/sarah-johnson/30min",
      avatar: "SJ",
    },
    {
      id: "3",
      name: "Mike Chen",
      role: "Product Manager",
      meetingLink: "https://cal.com/mike-chen/demo",
      avatar: "MC",
    },
    {
      id: "4",
      name: "Emily Rodriguez",
      role: "Solutions Engineer",
      meetingLink: "https://cal.com/emily-rodriguez/consultation",
      avatar: "ER",
    },
    {
      id: "5",
      name: "David Kim",
      role: "Account Executive",
      meetingLink: "https://cal.com/david-kim/discovery",
      avatar: "DK",
    },
  ])
  const [editingMember, setEditingMember] = useState(null)
  const [newMember, setNewMember] = useState({ name: "", role: "", meetingLink: "" })
  const [visitors, setVisitors] = useState([
    // Mock data for demonstration
    {
      id: "1",
      name: "Alex Thompson",
      title: "VP of Engineering",
      company: "TechCorp Solutions",
      email: "alex.thompson@techcorp.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      interests: ["AI/ML", "Cloud Infrastructure", "DevOps"],
      avatar: "AT",
      companyLogo: "/placeholder.svg?height=32&width=32&text=TC",
      opportunityCost: "$50K",
      abxIndicator: "High",
      meetingBooked: true,
      giftSent: false,
      crmSynced: true,
      scannedAt: new Date("2025-01-08T10:30:00"),
    },
    {
      id: "2",
      name: "Sarah Chen",
      title: "CTO",
      company: "InnovateLabs",
      email: "sarah.chen@innovatelabs.com",
      phone: "+1 (555) 987-6543",
      location: "Austin, TX",
      interests: ["Cybersecurity", "Cloud Architecture"],
      avatar: "SC",
      companyLogo: "/placeholder.svg?height=32&width=32&text=IL",
      opportunityCost: "$75K",
      abxIndicator: "Medium",
      meetingBooked: false,
      giftSent: true,
      crmSynced: false,
      scannedAt: new Date("2025-01-08T11:15:00"),
    },
    {
      id: "3",
      name: "Michael Rodriguez",
      title: "Security Director",
      company: "SecureNet Inc",
      email: "m.rodriguez@securenet.com",
      phone: "+1 (555) 456-7890",
      location: "New York, NY",
      interests: ["Zero Trust", "Threat Detection"],
      avatar: "MR",
      companyLogo: "/placeholder.svg?height=32&width=32&text=SN",
      opportunityCost: "$100K",
      abxIndicator: "High",
      meetingBooked: true,
      giftSent: true,
      crmSynced: true,
      scannedAt: new Date("2025-01-08T09:45:00"),
    },
  ])
  const [showVisitorsList, setShowVisitorsList] = useState(false)
  const [selectedRecipient, setSelectedRecipient] = useState("")
  const [scanningStep, setScanningStep] = useState("scanning") // 'scanning', 'profile', 'pitch', 'intent', 'complete'

  const generateAvatar = (name) => {
    const names = name.split(" ")
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const showSuccessAnimation = (message) => {
    setSuccessMessage(message)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  const handleSendEmail = () => {
    if (emailAddress) {
      const message = emailType === "meeting" ? "Meeting link sent via email!" : "Gift link sent via email!"
      showSuccessAnimation(message)
      setEmailAddress("")
      setShowEmailForm(false)
      if (emailType === "meeting") setShowMeetingQR(false)
      if (emailType === "gift") setShowGiftQR(false)
    }
  }

  const openEmailForm = (type) => {
    setEmailType(type)
    setShowEmailForm(true)
  }

  const addTeamMember = () => {
    if (newMember.name && newMember.role && newMember.meetingLink) {
      const id = Date.now().toString()
      const avatar = generateAvatar(newMember.name)
      setTeamMembers([...teamMembers, { ...newMember, id, avatar }])
      setNewMember({ name: "", role: "", meetingLink: "" })
      showSuccessAnimation("Team member added!")
    }
  }

  const updateTeamMember = () => {
    if (editingMember) {
      const updatedMember = {
        ...editingMember,
        avatar: generateAvatar(editingMember.name),
      }
      setTeamMembers(teamMembers.map((member) => (member.id === editingMember.id ? updatedMember : member)))
      setEditingMember(null)
      showSuccessAnimation("Team member updated!")
    }
  }

  const deleteTeamMember = (id) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id))
    if (selectedMember === id) {
      setSelectedMember("")
    }
    showSuccessAnimation("Team member removed!")
  }

  const handleBookMeeting = () => {
    if (selectedMember) {
      setShowMeetingQR(true)
    }
  }

  const handleLeadScan = () => {
    setShowLeadScanner(true)
    setScanningStep("scanning")
    setIsScanning(true)

    // Step 1: Badge Scanning (2 seconds)
    setTimeout(() => {
      setScanningStep("profile")
    }, 2000)

    // Step 2: Profile Enrichment (3 seconds)
    setTimeout(() => {
      setScanningStep("pitch")
    }, 5000)

    // Step 3: Pitch Enrichment (3 seconds)
    setTimeout(() => {
      setScanningStep("intent")
    }, 8000)

    // Step 4: Intent Score Calculation (3 seconds)
    setTimeout(() => {
      setScanningStep("complete")
      setIsScanning(false)
      setScannedLead({
        ...mockLeadData,
        internalIntent: 78,
        externalIntent: 65,
        pitchRelevance: "High",
        techStackMatch: "85%",
        linkedinProfile: `linkedin.com/in/${mockLeadData.name.toLowerCase().replace(" ", "-")}`,
      })

      // Add to visitors list if not already exists
      const existingVisitor = visitors.find((v) => v.email === mockLeadData.email)
      if (!existingVisitor) {
        const newVisitor = {
          id: Date.now().toString(),
          ...mockLeadData,
          avatar: mockLeadData.name
            .split(" ")
            .map((n) => n[0])
            .join(""),
          companyLogo:
            "/placeholder.svg?height=32&width=32&text=" +
            mockLeadData.company
              .split(" ")
              .map((w) => w[0])
              .join(""),
          opportunityCost: "$" + (Math.floor(Math.random() * 100) + 25) + "K",
          abxIndicator: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
          meetingBooked: false,
          giftSent: false,
          scannedAt: new Date(),
          crmSynced: false,
          internalIntent: 78,
          externalIntent: 65,
        }
        setVisitors((prev) => [newVisitor, ...prev])
      }
    }, 11000)
  }

  const selectedMemberData = teamMembers.find((member) => member.id === selectedMember)
  const selectedRecipientData = visitors.find((visitor) => visitor.id === selectedRecipient)
  const isGeneralGift = selectedRecipient === "general"

  const handleSendGiftToVisitor = (visitorId) => {
    setVisitors((prev) => prev.map((visitor) => (visitor.id === visitorId ? { ...visitor, giftSent: true } : visitor)))
    showSuccessAnimation("Gift sent to visitor!")
  }

  const handleCrmSync = (visitorId) => {
    setVisitors((prev) => prev.map((visitor) => (visitor.id === visitorId ? { ...visitor, crmSynced: true } : visitor)))
    showSuccessAnimation("Visitor synced to CRM!")
  }

  const getABXColor = (indicator) => {
    switch (indicator) {
      case "High":
        return "text-red-600 bg-red-50"
      case "Medium":
        return "text-yellow-600 bg-yellow-50"
      case "Low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-6 pb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booth Engagement</h1>
          <div className="relative w-full max-w-sm mx-auto">
            <img
              src="/blackhat-usa-2025.jpg"
              alt="Black Hat USA 2025 - August 2-7, 2025 - Mandalay Bay / Las Vegas"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="space-y-4">
          {/* Lead Scanner */}
          <Card className="border-2 hover:border-purple-300 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scan className="h-5 w-5 text-purple-600" />
                  Lead Scanner
                </div>
              </CardTitle>
              <CardDescription>Scan & enrich visitor data</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Lead Scanner - Primary Purple */}
              <Button
                onClick={handleLeadScan}
                variant="outline"
                className="w-full h-12 text-lg border-2 border-purple-600 text-purple-600 hover:bg-purple-50 flex items-center gap-2 bg-transparent"
                disabled={isScanning}
              >
                <Scan className="h-5 w-5" />
                {isScanning ? "Scanning..." : "Scan Badge"}
              </Button>
            </CardContent>
          </Card>

          {/* Book a Meeting */}
          <Card className="border-2 hover:border-purple-300 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Book Meeting
                </div>
                <div className="flex -space-x-1">
                  {teamMembers.slice(0, 3).map((member) => (
                    <div
                      key={member.id}
                      className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-700 border-2 border-white"
                    >
                      {member.avatar}
                    </div>
                  ))}
                  {teamMembers.length > 3 && (
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-700 border-2 border-white">
                      +{teamMembers.length - 3}
                    </div>
                  )}
                </div>
              </CardTitle>
              <CardDescription>Generate meeting QR codes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Select value={selectedMember} onValueChange={setSelectedMember}>
                  <SelectTrigger className="flex-1 h-12">
                    <SelectValue placeholder="Select team member">
                      {selectedMemberData && (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-700">
                            {selectedMemberData.avatar}
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-medium text-sm">{selectedMemberData.name}</span>
                            <span className="text-xs text-gray-500">{selectedMemberData.role}</span>
                          </div>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id} className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-medium text-purple-700">
                            {member.avatar}
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{member.name}</span>
                            <span className="text-sm text-gray-500">{member.role}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Plus button */}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowTeamManager(true)}
                  className="h-12 w-12 p-0 shrink-0 bg-purple-100 hover:bg-purple-200 text-purple-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {/* Book Meeting - Secondary Purple */}
              <Button
                onClick={handleBookMeeting}
                disabled={!selectedMember}
                variant="outline"
                className="w-full h-12 text-lg border-2 border-purple-600 text-purple-600 hover:bg-purple-50 flex items-center gap-2 bg-transparent"
              >
                <QrCode className="h-5 w-5" />
                Generate QR
              </Button>
            </CardContent>
          </Card>

          {/* Send Gift */}
          <Card className="border-2 hover:border-purple-300 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-purple-600" />
                  Send Gift
                </div>
              </CardTitle>
              <CardDescription>Share promotional offers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select recipient (optional)">
                    {selectedRecipientData && (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-700">
                          {selectedRecipientData.avatar}
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-sm">{selectedRecipientData.name}</span>
                          <span className="text-xs text-gray-500">{selectedRecipientData.company}</span>
                        </div>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-80 w-[var(--radix-select-trigger-width)]">
                  <SelectItem value="general" className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-500">
                        <Gift className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">General Gift</span>
                        <span className="text-sm text-gray-500">No specific recipient</span>
                      </div>
                    </div>
                  </SelectItem>
                  {visitors.map((visitor) => (
                    <SelectItem key={visitor.id} value={visitor.id} className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-medium text-purple-700">
                            {visitor.avatar}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border border-gray-200 flex items-center justify-center">
                            <img
                              src={visitor.companyLogo || "/placeholder.svg?height=12&width=12&text=C"}
                              alt={visitor.company}
                              className="w-2 h-2 rounded-full"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{visitor.name}</span>
                          <span className="text-sm text-gray-500">{visitor.company}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Send Gift - Outline/Inverse Purple */}
              <Button
                onClick={() => setShowGiftQR(true)}
                className="w-full h-12 text-lg bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
              >
                <QrCode className="h-5 w-5" />
                Show Gift QR
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Visitor Management Link */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Button
            onClick={() => setShowVisitorsList(true)}
            variant="ghost"
            className="w-full text-gray-600 hover:text-purple-600 hover:bg-purple-50"
          >
            <User className="h-4 w-4 mr-2" />
            View Scanned Visitors ({visitors.length})
          </Button>
        </div>
      </div>

      {/* Success Animation Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg p-6 shadow-xl animate-in zoom-in duration-300">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-purple-500 animate-in spin-in duration-500" />
              <p className="font-medium text-gray-900">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Email Form Sheet */}
      <Sheet open={showEmailForm} onOpenChange={setShowEmailForm}>
        <SheetContent side="bottom" className="h-[50vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send via Email
            </SheetTitle>
            <SheetDescription>
              {emailType === "meeting" ? "Send meeting link to visitor's email" : "Send gift link to visitor's email"}
              {selectedRecipientData && emailType === "gift" && (
                <span className="block mt-1 text-purple-600">
                  Sending to: {selectedRecipientData.name} ({selectedRecipientData.email})
                </span>
              )}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4 pb-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="visitor@company.com"
                value={
                  emailAddress || (selectedRecipientData && emailType === "gift" ? selectedRecipientData.email : "")
                }
                onChange={(e) => setEmailAddress(e.target.value)}
                className="focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSendEmail}
                disabled={!emailAddress && !(selectedRecipientData && emailType === "gift")}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" onClick={() => setShowEmailForm(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Lead Scanner Sheet */}
      <Sheet open={showLeadScanner} onOpenChange={setShowLeadScanner}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              Lead Scanner
            </SheetTitle>
            <SheetDescription>
              {scanningStep === "scanning" && "Scanning badge..."}
              {scanningStep === "profile" && "Enriching profile data..."}
              {scanningStep === "pitch" && "Analyzing pitch relevance..."}
              {scanningStep === "intent" && "Calculating intent scores..."}
              {scanningStep === "complete" && "Lead analysis complete"}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 pb-6">
            {scanningStep === "scanning" ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-12">
                <div className="w-32 h-32 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <p className="text-lg font-medium">Scanning badge...</p>
                <p className="text-sm text-gray-500">Please hold steady</p>
              </div>
            ) : scanningStep === "profile" ? (
              <div className="flex flex-col items-center justify-center space-y-6 py-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -inset-4 border-2 border-purple-300 rounded-full animate-ping opacity-75"></div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium">Profile Enrichment</p>
                  <p className="text-sm text-gray-500">Analyzing professional data...</p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <span>Extracting contact information</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div
                      className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <span>Enriching company details</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div
                      className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <span>Finding LinkedIn profile</span>
                  </div>
                </div>
              </div>
            ) : scanningStep === "pitch" ? (
              <div className="flex flex-col items-center justify-center space-y-6 py-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                    <Building className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -inset-4 border-2 border-green-300 rounded-full animate-ping opacity-75"></div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium">Pitch Enrichment</p>
                  <p className="text-sm text-gray-500">Analyzing company fit and relevance...</p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <span>Analyzing company tech stack</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div
                      className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <span>Identifying pain points</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div
                      className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <span>Matching solution relevance</span>
                  </div>
                </div>
              </div>
            ) : scanningStep === "intent" ? (
              <div className="flex flex-col items-center justify-center space-y-6 py-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <div className="text-white font-bold text-2xl">AI</div>
                  </div>
                  <div className="absolute -inset-4 border-2 border-orange-300 rounded-full animate-ping opacity-75"></div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium">Intent Score Analysis</p>
                  <p className="text-sm text-gray-500">Calculating buying intent signals...</p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                    <span>Analyzing internal signals</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div
                      className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <span>Processing external data</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div
                      className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <span>Computing intent scores</span>
                  </div>
                </div>
              </div>
            ) : scanningStep === "complete" && scannedLead ? (
              <div className="space-y-6">
                {/* Profile Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-purple-600 mb-3">
                    <CheckCircle className="h-4 w-4" />
                    Profile Enriched
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-xl font-bold text-purple-700">
                      {scannedLead.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{scannedLead.name}</h3>
                      <p className="text-gray-600">{scannedLead.title}</p>
                      <p className="text-sm text-gray-500">{scannedLead.company}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <span className="text-sm">{scannedLead.email}</span>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-5 w-5 text-gray-500 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </div>
                      <span className="text-sm text-blue-600">
                        linkedin.com/in/{scannedLead.name.toLowerCase().replace(" ", "-")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pitch Enrichment */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-green-600 mb-3">
                    <CheckCircle className="h-4 w-4" />
                    Pitch Enriched
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium mb-2 text-green-800">Company Analysis</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tech Stack Match:</span>
                        <span className="font-medium text-green-700">85% Compatible</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Solution Relevance:</span>
                        <span className="font-medium text-green-700">High</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pain Point Alignment:</span>
                        <span className="font-medium text-green-700">Strong Match</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Key Insight:</strong> {scannedLead.company} is actively expanding their cloud
                      infrastructure. Our security solutions align perfectly with their current DevOps transformation.
                    </p>
                  </div>
                </div>

                {/* Intent Scores */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-orange-600 mb-3">
                    <CheckCircle className="h-4 w-4" />
                    Intent Scores Calculated
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 text-center">
                      <div className="text-2xl font-bold text-orange-700 mb-1">78</div>
                      <div className="text-sm font-medium text-orange-800">Internal Intent</div>
                      <div className="text-xs text-orange-600 mt-1">High engagement signals</div>
                    </div>

                    <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-center">
                      <div className="text-2xl font-bold text-red-700 mb-1">65</div>
                      <div className="text-sm font-medium text-red-800">External Intent</div>
                      <div className="text-xs text-red-600 mt-1">Active research phase</div>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium text-yellow-800">Recommendation</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      High-priority lead. Schedule demo within 48 hours. Focus on cloud security and compliance
                      benefits.
                    </p>
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <h4 className="font-medium mb-2">Key Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {scannedLead.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setShowLeadScanner(false)
                    setScannedLead(null)
                    setScanningStep("scanning")
                    showSuccessAnimation("Lead saved successfully!")
                  }}
                  className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
                >
                  Save Enriched Lead
                </Button>
              </div>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>

      {/* Meeting QR Sheet */}
      <Sheet open={showMeetingQR} onOpenChange={setShowMeetingQR}>
        <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Meeting with {selectedMemberData?.name}
            </SheetTitle>
            <SheetDescription>Scan QR code or send via email to book a meeting</SheetDescription>
          </SheetHeader>

          <div className="flex flex-col items-center justify-center space-y-6 mt-8 pb-6">
            <div className="p-4 bg-white rounded-lg shadow-lg">
              <img src="/pinkesh-book-meeting-qr.png" alt="Meeting QR Code" className="w-48 h-48" />
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-medium text-purple-700">
                  {selectedMemberData?.avatar}
                </div>
                <p className="font-medium">{selectedMemberData?.role}</p>
              </div>
              <p className="text-sm text-gray-500">
                Scan to schedule a meeting with {selectedMemberData?.name.split(" ")[0]}
              </p>
            </div>

            <div className="flex gap-3 w-full">
              <Button
                onClick={() => openEmailForm("meeting")}
                variant="outline"
                className="flex-1 border-purple-200 hover:bg-purple-50"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" onClick={() => setShowMeetingQR(false)} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Gift QR Sheet */}
      <Sheet open={showGiftQR} onOpenChange={setShowGiftQR}>
        <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              {selectedRecipientData
                ? `Gift for ${selectedRecipientData.name}`
                : isGeneralGift
                  ? "General Promotional Gift"
                  : "Promotional Gift"}
            </SheetTitle>
            <SheetDescription>
              {selectedRecipientData
                ? `Send personalized gift to ${selectedRecipientData.name} at ${selectedRecipientData.company}`
                : "Scan QR code or send via email to claim gift"}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col items-center justify-center space-y-6 mt-8 pb-6">
            {selectedRecipientData && (
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200 w-full">
                <div className="relative">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-sm font-medium text-purple-700">
                    {selectedRecipientData.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border border-gray-200 flex items-center justify-center">
                    <img
                      src={selectedRecipientData.companyLogo || "/placeholder.svg?height=12&width=12&text=C"}
                      alt={selectedRecipientData.company}
                      className="w-2 h-2 rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">{selectedRecipientData.name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedRecipientData.title} • {selectedRecipientData.company}
                  </p>
                </div>
              </div>
            )}

            <div className="p-4 bg-white rounded-lg shadow-lg">
              <img src="/campaign-gift-qr.svg" alt="Gift QR Code" className="w-48 h-48" />
            </div>

            <div className="text-center space-y-2">
              <p className="font-medium text-purple-600">🎁 Special Booth Gift</p>
              <p className="text-sm text-gray-500">
                {selectedRecipientData
                  ? `Personalized offer for ${selectedRecipientData.name}`
                  : "Scan to claim your exclusive promotional offer"}
              </p>
            </div>

            <div className="flex gap-3 w-full">
              <Button
                onClick={() => openEmailForm("gift")}
                variant="outline"
                className="flex-1 border-purple-200 hover:bg-purple-50"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowGiftQR(false)
                  if (selectedRecipientData) {
                    handleSendGiftToVisitor(selectedRecipientData.id)
                  } else {
                    showSuccessAnimation("Gift shared!")
                  }
                }}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Team Manager Sheet */}
      <Sheet open={showTeamManager} onOpenChange={setShowTeamManager}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Manage Team Members
            </SheetTitle>
            <SheetDescription>Add, edit, or remove team members and their meeting links</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6 pb-6">
            {/* Add New Member Form */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium">Add New Team Member</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  placeholder="Role/Title"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="url"
                  placeholder="Meeting Link (e.g., https://cal.com/username)"
                  value={newMember.meetingLink}
                  onChange={(e) => setNewMember({ ...newMember, meetingLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Button onClick={addTeamMember} className="w-full bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </div>
            </div>

            {/* Existing Team Members */}
            <div className="space-y-3">
              <h3 className="font-medium">Current Team Members</h3>
              {teamMembers.map((member) => (
                <div key={member.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  {editingMember?.id === member.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingMember.name}
                        onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="text"
                        value={editingMember.role}
                        onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="url"
                        value={editingMember.meetingLink}
                        onChange={(e) => setEditingMember({ ...editingMember, meetingLink: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={updateTeamMember}
                          size="sm"
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button onClick={() => setEditingMember(null)} variant="outline" size="sm" className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-sm font-medium text-purple-700">
                            {member.avatar}
                          </div>
                          <div>
                            <h4 className="font-medium">{member.name}</h4>
                            <p className="text-sm text-gray-600">{member.role}</p>
                            <p className="text-xs text-gray-500 truncate max-w-48">{member.meetingLink}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setEditingMember(member)}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <User className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => deleteTeamMember(member.id)}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button onClick={() => setShowTeamManager(false)} variant="outline" className="w-full mt-6">
              Done
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Visitors List Sheet */}
      <Sheet open={showVisitorsList} onOpenChange={setShowVisitorsList}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Scanned Visitors ({visitors.length})
            </SheetTitle>
            <SheetDescription>Manage and track all visitors scanned at your booth</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4 pb-6">
            {visitors.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No visitors scanned yet</p>
                <p className="text-sm text-gray-400">Start scanning badges to see visitors here</p>
              </div>
            ) : (
              visitors.map((visitor) => (
                <div key={visitor.id} className="bg-white border border-gray-200 rounded-lg p-3 space-y-3">
                  {/* Header with Avatar, Company Logo, and Basic Info */}
                  <div className="flex items-start gap-3">
                    {/* Avatar with Company Logo Overlay */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-sm font-medium text-purple-700">
                        {visitor.avatar}
                      </div>
                      {/* Company Logo Overlay */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border border-gray-200 flex items-center justify-center">
                        <img
                          src={visitor.companyLogo || "/placeholder.svg?height=16&width=16&text=C"}
                          alt={visitor.company}
                          className="w-3 h-3 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Visitor Info */}
                    <div className="flex-1 min-w-0">
                      {/* Line 1: Name, Designation, Company */}
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base truncate">{visitor.name}</h3>
                          <p className="text-sm text-gray-600 truncate">
                            {visitor.title} • {visitor.company}
                          </p>
                        </div>
                        <div className="text-right text-xs text-gray-400 whitespace-nowrap ml-2">
                          {visitor.scannedAt.toLocaleDateString([], { month: "short", day: "numeric" })}
                          <br />
                          {visitor.scannedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>

                      {/* Line 2: Opportunity Cost */}
                      <div className="mt-1">
                        <span className="text-sm text-green-600 font-medium">
                          Opportunity: {visitor.opportunityCost || "$0"}
                        </span>
                      </div>

                      {/* Line 3: ABX Indicator */}
                      <div className="mt-1">
                        <span className="text-sm text-gray-600">
                          ABX Indicator:
                          <span
                            className={cn(
                              "ml-1 font-medium",
                              visitor.abxIndicator === "High"
                                ? "text-green-600"
                                : visitor.abxIndicator === "Medium"
                                  ? "text-yellow-600"
                                  : visitor.abxIndicator === "Low"
                                    ? "text-red-600"
                                    : "text-gray-500",
                            )}
                          >
                            {visitor.abxIndicator === "High"
                              ? "+ve"
                              : visitor.abxIndicator === "Medium"
                                ? "+ve"
                                : visitor.abxIndicator === "Low"
                                  ? "-ve"
                                  : "Unknown"}
                          </span>
                        </span>
                      </div>

                      {/* Line 4: Status Icons and Action Buttons */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                        {/* Status Icons - Left Side */}
                        <div className="flex items-center gap-3">
                          {/* Meeting Status */}
                          <Calendar
                            className={cn("h-4 w-4", visitor.meetingBooked ? "text-green-500" : "text-gray-300")}
                          />

                          {/* Gift Status */}
                          <Gift className={cn("h-4 w-4", visitor.giftSent ? "text-green-500" : "text-gray-300")} />

                          {/* CRM Synced Status */}
                          <RefreshCw
                            className={cn("h-4 w-4", visitor.crmSynced ? "text-green-500" : "text-gray-300")}
                          />
                        </div>

                        {/* Action Buttons - Right Side */}
                        <div className="flex items-center gap-2">
                          {/* CRM Sync Button */}
                          <Button
                            onClick={() => handleCrmSync(visitor.id)}
                            size="sm"
                            variant="outline"
                            disabled={visitor.crmSynced}
                            className={cn(
                              "h-7 px-2 text-xs",
                              visitor.crmSynced
                                ? "border-green-200 text-green-600 bg-green-50"
                                : "border-purple-200 text-purple-600 hover:bg-purple-50",
                            )}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            {visitor.crmSynced ? "Synced" : "Sync"}
                          </Button>

                          {/* Gift Action Button */}
                          <Button
                            onClick={() => (visitor.giftSent ? null : handleSendGiftToVisitor(visitor.id))}
                            size="sm"
                            variant={visitor.giftSent ? "outline" : "default"}
                            className={cn(
                              "h-7 px-2 text-xs",
                              visitor.giftSent
                                ? "border-green-200 text-green-600 bg-green-50"
                                : "bg-purple-600 hover:bg-purple-700 text-white",
                            )}
                          >
                            <Gift className="h-3 w-3 mr-1" />
                            {visitor.giftSent ? "Track" : "Send"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="sticky bottom-0 bg-white pt-4 border-t">
            <Button onClick={() => setShowVisitorsList(false)} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
