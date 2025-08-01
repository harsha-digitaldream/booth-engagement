"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
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
  Briefcase,
  Factory,
  MapPin,
  DollarSign,
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
  const [scanningStep, setScanningStep] = useState("camera") // 'camera', 'form', 'enriching', 'complete'
  const [contactForm, setContactForm] = useState({
    name: "",
    role: "",
    email: "",
    linkedin: "",
    company: "",
    industry: "",
    geography: "",
    revenue: "",
  })
  const [isEnriching, setIsEnriching] = useState(false)
  const [enrichingField, setEnrichingField] = useState("")

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
    setScanningStep("camera")
    setIsScanning(false)
    setScannedLead(null)
  }

  const simulateCameraScan = () => {
    setIsScanning(true)

    // Simulate camera scanning for 3 seconds
    setTimeout(() => {
      setIsScanning(false)
      setScanningStep("form")

      // Pre-fill basic contact info
      setContactForm({
        name: "Alex Thompson",
        role: "VP of Engineering",
        company: "TechCorp Solutions",
        email: "",
        linkedin: "",
        industry: "",
        geography: "",
        revenue: "",
      })
    }, 3000)
  }

  const enrichContact = () => {
    setIsEnriching(true)
    const fieldsToEnrich = [
      { field: "email", value: "alex.thompson@techcorp.com", delay: 1000 },
      { field: "linkedin", value: "linkedin.com/in/alex-thompson-vp", delay: 2000 },
      { field: "industry", value: "Technology & Software", delay: 3000 },
      { field: "geography", value: "San Francisco, CA", delay: 4000 },
      { field: "revenue", value: "$50M - $100M", delay: 5000 },
    ]

    fieldsToEnrich.forEach(({ field, value, delay }) => {
      setTimeout(() => {
        setEnrichingField(field)
        setTimeout(() => {
          setContactForm((prev) => ({ ...prev, [field]: value }))
          setEnrichingField("")
        }, 800)
      }, delay)
    })

    setTimeout(() => {
      setIsEnriching(false)
      setScanningStep("complete")
      // Show celebration animation
      showSuccessAnimation("🎉 Contact enriched successfully!")
    }, 6500)
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
    <div className="min-h-screen bg-gray-50 p-4">
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
          <Card className="bg-white border border-gray-200 hover:border-purple-200 transition-colors shadow-sm">
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
          <Card className="bg-white border border-gray-200 hover:border-purple-200 transition-colors shadow-sm">
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
          <Card className="bg-white border border-gray-200 hover:border-purple-200 transition-colors shadow-sm">
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
              {scanningStep === "camera" && "Position badge in camera view"}
              {scanningStep === "form" && "Review and enrich contact information"}
              {scanningStep === "enriching" && "Enriching contact data..."}
              {scanningStep === "complete" && "Contact enrichment complete"}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 pb-6 space-y-6">
            {/* Camera View */}
            {scanningStep === "camera" && (
              <div className="flex flex-col items-center justify-center space-y-6 py-8">
                <div className="relative w-full max-w-sm mx-auto">
                  {/* Camera Preview Simulation */}
                  <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>

                    {/* Scanning Overlay */}
                    <div className="absolute inset-4 border-2 border-white/30 rounded-lg">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-purple-400"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-purple-400"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-purple-400"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-400"></div>
                    </div>

                    {/* Scanning Animation */}
                    {isScanning && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-1 bg-purple-500 animate-pulse"></div>
                      </div>
                    )}

                    {/* Instructions */}
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <p className="text-white text-sm">
                        {isScanning ? "Scanning badge..." : "Position badge within frame"}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={simulateCameraScan}
                  disabled={isScanning}
                  className="w-full max-w-sm bg-purple-600 hover:bg-purple-700"
                >
                  {isScanning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Scan className="h-4 w-4 mr-2" />
                      Start Scan
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Contact Form */}
            {(scanningStep === "form" || scanningStep === "enriching" || scanningStep === "complete") && (
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg">
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900">Contact Information</h3>
                  </div>

                  <div className="p-4 space-y-3">
                    {/* Name */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        />
                      </div>
                    </div>

                    {/* Role */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Role"
                          value={contactForm.role}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, role: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center relative">
                        <Mail
                          className={cn(
                            "h-4 w-4 transition-all duration-300",
                            enrichingField === "email"
                              ? "text-purple-500 animate-pulse"
                              : contactForm.email
                                ? "text-purple-500"
                                : "text-gray-500",
                          )}
                        />
                        {enrichingField === "email" && (
                          <div className="absolute -inset-1 border border-purple-300 rounded-full animate-ping"></div>
                        )}
                      </div>
                      <div className="flex-1 relative">
                        <input
                          type="email"
                          placeholder="Email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                          className={cn(
                            "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all duration-300",
                            enrichingField === "email" && "ring-2 ring-purple-500 bg-purple-50 border-purple-300",
                            contactForm.email && scanningStep === "complete" && "border-purple-300 bg-purple-50",
                          )}
                        />
                        {enrichingField === "email" && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-purple-600 font-medium animate-pulse">
                            Enriching...
                          </div>
                        )}
                      </div>
                    </div>

                    {/* LinkedIn */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center relative">
                        <div
                          className={cn(
                            "h-4 w-4 transition-all duration-300 flex items-center justify-center",
                            enrichingField === "linkedin"
                              ? "text-purple-500"
                              : contactForm.linkedin
                                ? "text-purple-500"
                                : "text-gray-500",
                          )}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className={cn("h-4 w-4 fill-current", enrichingField === "linkedin" && "animate-pulse")}
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </div>
                        {enrichingField === "linkedin" && (
                          <div className="absolute -inset-1 border border-purple-300 rounded-full animate-ping"></div>
                        )}
                      </div>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="LinkedIn"
                          value={contactForm.linkedin}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, linkedin: e.target.value }))}
                          className={cn(
                            "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all duration-300",
                            enrichingField === "linkedin" && "ring-2 ring-purple-500 bg-purple-50 border-purple-300",
                            contactForm.linkedin && scanningStep === "complete" && "border-purple-300 bg-purple-50",
                          )}
                        />
                        {enrichingField === "linkedin" && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-purple-600 font-medium animate-pulse">
                            Enriching...
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Company */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <Building className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Company"
                          value={contactForm.company}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, company: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        />
                      </div>
                    </div>

                    {/* Industry */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center relative">
                        <Factory
                          className={cn(
                            "h-4 w-4 transition-all duration-300",
                            enrichingField === "industry"
                              ? "text-purple-500 animate-pulse"
                              : contactForm.industry
                                ? "text-purple-500"
                                : "text-gray-500",
                          )}
                        />
                        {enrichingField === "industry" && (
                          <div className="absolute -inset-1 border border-purple-300 rounded-full animate-ping"></div>
                        )}
                      </div>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Industry"
                          value={contactForm.industry}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, industry: e.target.value }))}
                          className={cn(
                            "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all duration-300",
                            enrichingField === "industry" && "ring-2 ring-purple-500 bg-purple-50 border-purple-300",
                            contactForm.industry && scanningStep === "complete" && "border-purple-300 bg-purple-50",
                          )}
                        />
                        {enrichingField === "industry" && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-purple-600 font-medium animate-pulse">
                            Enriching...
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Geography */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center relative">
                        <MapPin
                          className={cn(
                            "h-4 w-4 transition-all duration-300",
                            enrichingField === "geography"
                              ? "text-purple-500 animate-pulse"
                              : contactForm.geography
                                ? "text-purple-500"
                                : "text-gray-500",
                          )}
                        />
                        {enrichingField === "geography" && (
                          <div className="absolute -inset-1 border border-purple-300 rounded-full animate-ping"></div>
                        )}
                      </div>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Geography"
                          value={contactForm.geography}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, geography: e.target.value }))}
                          className={cn(
                            "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all duration-300",
                            enrichingField === "geography" && "ring-2 ring-purple-500 bg-purple-50 border-purple-300",
                            contactForm.geography && scanningStep === "complete" && "border-purple-300 bg-purple-50",
                          )}
                        />
                        {enrichingField === "geography" && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-purple-600 font-medium animate-pulse">
                            Enriching...
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Revenue */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center relative">
                        <DollarSign
                          className={cn(
                            "h-4 w-4 transition-all duration-300",
                            enrichingField === "revenue"
                              ? "text-purple-500 animate-pulse"
                              : contactForm.revenue
                                ? "text-purple-500"
                                : "text-gray-500",
                          )}
                        />
                        {enrichingField === "revenue" && (
                          <div className="absolute -inset-1 border border-purple-300 rounded-full animate-ping"></div>
                        )}
                      </div>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Revenue"
                          value={contactForm.revenue}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, revenue: e.target.value }))}
                          className={cn(
                            "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all duration-300",
                            enrichingField === "revenue" && "ring-2 ring-purple-500 bg-purple-50 border-purple-300",
                            contactForm.revenue && scanningStep === "complete" && "border-purple-300 bg-purple-50",
                          )}
                        />
                        {enrichingField === "revenue" && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-purple-600 font-medium animate-pulse">
                            Enriching...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enrich Button */}
                {scanningStep === "form" && (
                  <Button onClick={enrichContact} className="w-full bg-purple-600 hover:bg-purple-700">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 bg-purple-200 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      </div>
                      Enrich Contact
                    </div>
                  </Button>
                )}

                {/* Enriching Status */}
                {scanningStep === "enriching" && (
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      <div>
                        <p className="font-medium text-purple-800">Enriching Contact Data</p>
                        <p className="text-sm text-purple-600">Using AI to find missing information...</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                {scanningStep === "complete" && (
                  <Button
                    onClick={() => {
                      setShowLeadScanner(false)
                      setScanningStep("camera")
                      setContactForm({
                        name: "",
                        role: "",
                        email: "",
                        linkedin: "",
                        company: "",
                        industry: "",
                        geography: "",
                        revenue: "",
                      })
                      showSuccessAnimation("Contact saved successfully!")
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Save Contact
                  </Button>
                )}
              </div>
            )}
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

                      {/* Line 2: LinkedIn Opportunity */}
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm text-gray-900 font-medium">Linked Opportunity:</span>
                        <div className="flex gap-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {visitor.id === "1" ? "$0" : visitor.id === "2" ? "$75K" : "$100K"}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {visitor.id === "1" ? "$25K" : visitor.id === "2" ? "$200K" : "$450K"}
                          </span>
                        </div>
                      </div>

                      {/* Line 3: ABX Indicator */}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm text-gray-900 font-medium">ABX Indicator:</span>
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                            visitor.abxIndicator === "High" || visitor.abxIndicator === "Medium"
                              ? "bg-green-100 text-green-800"
                              : visitor.abxIndicator === "Low"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800",
                          )}
                        >
                          {visitor.abxIndicator === "High" || visitor.abxIndicator === "Medium"
                            ? "Positive"
                            : visitor.abxIndicator === "Low"
                              ? "Negative"
                              : "Unknown"}
                        </span>
                      </div>

                      {/* Line 4: Status Icons and Action Buttons */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                        {/* Status Icons - Left Side */}
                        <div className="flex items-center gap-3">
                          {/* Meeting Status */}
                          <Calendar
                            className={cn("h-4 w-4", visitor.meetingBooked ? "text-purple-500" : "text-gray-400")}
                          />

                          {/* Gift Status */}
                          <Gift className={cn("h-4 w-4", visitor.giftSent ? "text-purple-500" : "text-gray-400")} />

                          {/* CRM Synced Status */}
                          <RefreshCw
                            className={cn("h-4 w-4", visitor.crmSynced ? "text-purple-500" : "text-gray-400")}
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
