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
  Phone,
  MapPin,
  QrCode,
  Plus,
  Save,
  Trash2,
  CheckCircle,
  Send,
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
      name: "Sarah Johnson",
      role: "Sales Director",
      meetingLink: "https://cal.com/sarah-johnson/30min",
      avatar: "SJ",
    },
    {
      id: "2",
      name: "Mike Chen",
      role: "Product Manager",
      meetingLink: "https://cal.com/mike-chen/demo",
      avatar: "MC",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      role: "Solutions Engineer",
      meetingLink: "https://cal.com/emily-rodriguez/consultation",
      avatar: "ER",
    },
    {
      id: "4",
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
      scannedAt: new Date("2025-01-08T09:45:00"),
    },
  ])
  const [showVisitorsList, setShowVisitorsList] = useState(false)

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
    setIsScanning(true)

    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false)
      setScannedLead(mockLeadData)

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
        }
        setVisitors((prev) => [newVisitor, ...prev])
      }
    }, 2000)
  }

  const selectedMemberData = teamMembers.find((member) => member.id === selectedMember)

  const handleSendGiftToVisitor = (visitorId) => {
    setVisitors((prev) => prev.map((visitor) => (visitor.id === visitorId ? { ...visitor, giftSent: true } : visitor)))
    showSuccessAnimation("Gift sent to visitor!")
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
        <div className="text-center space-y-3 pt-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">Booth Engagement</h1>
            <p className="text-gray-600">Delight Booth Attendees</p>
          </div>
          <div className="pt-2">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Event</p>
            <h2 className="text-lg font-semibold text-gray-800">BlackHat Briefing 2025</h2>
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
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <img src="/placeholder.svg?height=24&width=24&text=QR" alt="QR Preview" className="w-4 h-4" />
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
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <img src="/placeholder.svg?height=24&width=24&text=🎁" alt="Gift Preview" className="w-4 h-4" />
                </div>
              </CardTitle>
              <CardDescription>Share promotional offers</CardDescription>
            </CardHeader>
            <CardContent>
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
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4 pb-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="visitor@company.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSendEmail}
                disabled={!emailAddress}
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
            <SheetDescription>{isScanning ? "Scanning badge..." : "Lead information enriched"}</SheetDescription>
          </SheetHeader>

          <div className="mt-6 pb-6">
            {isScanning ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-12">
                <div className="w-32 h-32 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <p className="text-lg font-medium">Scanning badge...</p>
                <p className="text-sm text-gray-500">Please hold steady</p>
              </div>
            ) : scannedLead ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{scannedLead.name}</h3>
                    <p className="text-gray-600">{scannedLead.title}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Building className="h-5 w-5 text-gray-500" />
                    <span>{scannedLead.company}</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <span className="text-sm">{scannedLead.email}</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span>{scannedLead.phone}</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span>{scannedLead.location}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {scannedLead.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setShowLeadScanner(false)
                    setScannedLead(null)
                    showSuccessAnimation("Lead saved successfully!")
                  }}
                  className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
                >
                  Save Lead
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
              <img
                src={`/placeholder.svg?height=200&width=200&text=QR+Code+Meeting+Link`}
                alt="Meeting QR Code"
                className="w-48 h-48"
              />
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
              Promotional Gift
            </SheetTitle>
            <SheetDescription>Scan QR code or send via email to claim gift</SheetDescription>
          </SheetHeader>

          <div className="flex flex-col items-center justify-center space-y-6 mt-8 pb-6">
            <div className="p-4 bg-white rounded-lg shadow-lg">
              <img
                src={`/placeholder.svg?height=200&width=200&text=Gift+QR+Code`}
                alt="Gift QR Code"
                className="w-48 h-48"
              />
            </div>

            <div className="text-center space-y-2">
              <p className="font-medium text-purple-600">🎁 Special Booth Gift</p>
              <p className="text-sm text-gray-500">Scan to claim your exclusive promotional offer</p>
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
                  showSuccessAnimation("Gift shared!")
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
                <div key={visitor.id} className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
                  {/* Header with Avatar and Basic Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-sm font-medium text-purple-700">
                        {visitor.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-base truncate">{visitor.name}</h3>
                          <Badge className={cn("text-xs px-1.5 py-0.5", getABXColor(visitor.abxIndicator))}>
                            {visitor.abxIndicator}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{visitor.title}</p>
                        <div className="flex items-center gap-1.5">
                          <img
                            src={visitor.companyLogo || "/placeholder.svg"}
                            alt={visitor.company}
                            className="w-3 h-3"
                          />
                          <span className="text-xs text-gray-500 truncate">{visitor.company}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-green-600 font-medium">{visitor.opportunityCost}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-400 whitespace-nowrap ml-2">
                      {visitor.scannedAt.toLocaleDateString([], { month: "short", day: "numeric" })}
                      <br />
                      {visitor.scannedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>

                  {/* Contact Info Row */}
                  <div className="flex items-center gap-3 text-xs text-gray-600 overflow-hidden">
                    <div className="flex items-center gap-1 min-w-0 flex-1">
                      <Mail className="h-3 w-3 shrink-0" />
                      <span className="truncate">{visitor.email}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Phone className="h-3 w-3" />
                      <span className="whitespace-nowrap">{visitor.phone}</span>
                    </div>
                  </div>

                  {/* Location and Interests Row */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{visitor.location}</span>
                    </div>

                    {/* Interests */}
                    {visitor.interests && visitor.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {visitor.interests.map((interest, index) => (
                          <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0.5 h-5">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      {/* Meeting Status */}
                      <div className="flex items-center gap-1">
                        <Calendar
                          className={cn("h-3.5 w-3.5", visitor.meetingBooked ? "text-green-500" : "text-gray-300")}
                        />
                        <span className={cn("text-xs", visitor.meetingBooked ? "text-green-600" : "text-gray-400")}>
                          {visitor.meetingBooked ? "Meeting" : "No Meeting"}
                        </span>
                      </div>

                      {/* Gift Status */}
                      <div className="flex items-center gap-1">
                        <Gift className={cn("h-3.5 w-3.5", visitor.giftSent ? "text-purple-500" : "text-gray-300")} />
                        <span className={cn("text-xs", visitor.giftSent ? "text-purple-600" : "text-gray-400")}>
                          {visitor.giftSent ? "Gift Sent" : "No Gift"}
                        </span>
                      </div>
                    </div>

                    {/* Send Gift Button */}
                    {!visitor.giftSent && (
                      <Button
                        onClick={() => handleSendGiftToVisitor(visitor.id)}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 h-7 px-2 text-xs"
                      >
                        <Gift className="h-3 w-3 mr-1" />
                        Send Gift
                      </Button>
                    )}
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
