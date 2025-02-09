"use client";

import { Activity, Calendar, ClipboardList, MessageCircle, Dumbbell, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/app/componenets/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/componenets/card";
import Sessions from "../interfaces/Sessions";
import Client from "../interfaces/Client";

export default function TrainerDashboard() {



  // State variables
  const [clients, setClients] = useState<Client[]>([]);
  const [sessions, setSessions] = useState<Sessions[]>([]);

  // Fetch clients data
  const fetchClients = () => {
    axios
      .get("/api/clients", { withCredentials: true })
      .then((res) => {
        setClients(res.data);
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
      });
  };

  // Fetch sessions data
  const fetchSessions = () => {
    axios
      .get("/api/sessions", { withCredentials: true })
      .then((res) => {
        setSessions(res.data);
      })
      .catch((error) => {
        console.error("Error fetching sessions:", error);
      });
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchClients();
    fetchSessions();
  }, []);

  return (
    <div className="min-h-screen bg-[#E1E5F2] text-[#022B3A]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#1F7A8C]">
        <div className="flex items-center gap-4">
          <Image
            src="/companyLogo.png" // Replace with your company logo
            alt="Company Logo"
            width={40}
            height={40}
          />
          <h1 className="text-xl font-bold text-[#FFFFFF]">Trainer Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button className="bg-[#BFDBF7] text-[#022B3A] hover:bg-[#A0C4E2]">
            <Link href="/profile">Profile</Link>
          </Button>
          <Button className="bg-[#BFDBF7] text-[#022B3A] hover:bg-[#A0C4E2]">
            <Link href="/">Logout</Link>
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Upcoming Sessions Card */}
          <Card className="bg-[#FFFFFF] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="text-[#1F7A8C]" />
                Upcoming Sessions
              </CardTitle>
              <CardDescription>View and manage your upcoming training sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.length === 0 ? (
                  <p>No sessions found.</p>
                ) : (
                  sessions.map((session) => (
                    <div key={session.sessionID} className="flex items-center justify-between">
                      <p className="font-medium">{session.clientName}</p>
                      <p className="text-sm text-[#1F7A8C]">
                        {new Date(session.sessionTimeStamp).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Client List Card */}
          <Card className="bg-[#FFFFFF] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="text-[#1F7A8C]" />
                Client List
              </CardTitle>
              <CardDescription>Manage your clients and their fitness progress.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clients.length === 0 ? (
                  <p>No clients found.</p>
                ) : (
                  clients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between">
                      <p className="font-medium">{`${client.firstName} ${client.lastName}`}</p>
                      <p className="text-sm text-[#1F7A8C]">{client.fitnessGoal}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Fitness Plans Card */}
          <Card className="bg-[#FFFFFF] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="text-[#1F7A8C]" />
                Fitness Plans
              </CardTitle>
              <CardDescription>Access and update client fitness plans.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full bg-[#BFDBF7] text-[#022B3A] hover:bg-[#A0C4E2]">
                  <Link href="/fitness-plans">View All Plans</Link>
                </Button>
                <Button className="w-full bg-[#BFDBF7] text-[#022B3A] hover:bg-[#A0C4E2]">
                  <Link href="/add-plan">Add New Plan</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="bg-[#FFFFFF] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="text-[#1F7A8C]" />
                Quick Actions
              </CardTitle>
              <CardDescription>Quickly access important features.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full bg-[#BFDBF7] text-[#022B3A] hover:bg-[#A0C4E2]">
                  <Link href="https://calendly.com/swftt-inc/trainer-session">Book Session</Link>
                </Button>
                <Button className="w-full bg-[#BFDBF7] text-[#022B3A] hover:bg-[#A0C4E2]">
                  <Link href="/request-equipment">Request Equipment</Link>
                </Button>
                <Button className="w-full bg-[#BFDBF7] text-[#022B3A] hover:bg-[#A0C4E2]">
                  <Link href="/fitness-plans">View Client Progress</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Fitness Metrics Overview Card */}
          <Card className="bg-[#FFFFFF] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="text-[#1F7A8C]" />
                Fitness Metrics Overview
              </CardTitle>
              <CardDescription>Track client fitness metrics.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p><strong>Average Weight Loss:</strong> 5 kg</p>
                <p><strong>Average Muscle Gain:</strong> 2 kg</p>
                <p><strong>Most Common Goal:</strong> Weight Loss</p>
              </div>
            </CardContent>
          </Card>

          {/* Chat with Clients and AI Companion Card */}
          <Card className="bg-[#FFFFFF] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="text-[#1F7A8C]" />
                Chat
              </CardTitle>
              <CardDescription>Communicate with your clients or AI Companion.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full bg-[#BFDBF7] text-[#022B3A] hover:bg-[#A0C4E2]">
                  <Link href="/chat-clients">View Chat History</Link>
                </Button>
                <Button className="w-full bg-[#BFDBF7] text-[#022B3A] hover:bg-[#A0C4E2]">
                  <Link href="/tchatbox">Start New Chat with Client</Link>
                </Button>
                <Button className="w-full bg-[#1F7A8C] text-[#FFFFFF] hover:bg-[#165E6F]">
                  <Link href="/taichatbox">Chat with AI Companion</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 bg-[#1F7A8C] text-[#FFFFFF] text-center">
        <p>© {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
}