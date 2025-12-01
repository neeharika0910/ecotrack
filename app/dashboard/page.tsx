"use client";

import React, { useEffect, useState } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import { Users, Clock, Shield, Heart } from "lucide-react";

interface EmissionData { id: string; date: string; transport: number; energy: number; food: number; total: number; }

export default function DashboardPage() {
  const [emissionData, setEmissionData] = useState<EmissionData[]>([]);
  const [currentEcoScore, setCurrentEcoScore] = useState<number>(0);
  const [transportMode, setTransportMode] = useState<string>("car");
  const [distance, setDistance] = useState<string>("");
  const [energyUsage, setEnergyUsage] = useState<string>("");
  const [dietType, setDietType] = useState<string>("mixed");
  const [activeTab, setActiveTab] = useState<"dashboard" | "calculator">("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function load(){
      const res = await fetch("/api/load");
      const data = await res.json();
      if (!res.ok) {
        window.location.href = "/login";
        return;
      }
      setEmissionData(data.emissions || []);
      setCurrentEcoScore(data.user?.ecoScore ?? 0);
      setLoading(false);
    }
    load();
  }, []);

  const calculateEmissions = async () => {
    if (!distance || !energyUsage) return;
    let transportEmission = 0;
    switch (transportMode) {
      case "car": transportEmission = parseFloat(distance) * 0.24; break;
      case "bus": transportEmission = parseFloat(distance) * 0.10; break;
      case "bike": transportEmission = parseFloat(distance) * 0.02; break;
      case "walk": transportEmission = 0; break;
      default: transportEmission = parseFloat(distance) * 0.24;
    }
    const energyEmission = parseFloat(energyUsage) * 0.45;
    let foodEmission = 0;
    switch (dietType) {
      case "vegan": foodEmission = 1.5; break;
      case "vegetarian": foodEmission = 2.0; break;
      case "mixed": foodEmission = 3.0; break;
      case "meat-heavy": foodEmission = 4.5; break;
      default: foodEmission = 3.0;
    }
    const totalEmission = transportEmission + energyEmission + foodEmission;
    const newEntry = { date: new Date().toISOString().split("T")[0], transport: parseFloat(transportEmission.toFixed(2)), energy: parseFloat(energyEmission.toFixed(2)), food: foodEmission, total: parseFloat(totalEmission.toFixed(2)) };
    const res = await fetch("/api/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newEntry) });
    const data = await res.json();
    if (res.ok) {
      setEmissionData(prev => [...prev, { id: data.entry.id, ...newEntry }]);
      const loadRes = await fetch("/api/load");
      const loadData = await loadRes.json();
      setCurrentEcoScore(loadData.user?.ecoScore ?? currentEcoScore);
    } else {
      alert(data.error || "Failed to save");
    }
    setDistance(""); setEnergyUsage("");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div><h1 className="text-4xl font-bold text-green-800">EcoTrack</h1><p className="text-green-600">Smart Carbon Footprint Analyzer</p></div>
          <div className="flex items-center gap-4"><div className="bg-white rounded-full p-2 shadow"><Heart className="text-red-500" /></div><div><p className="text-sm text-gray-600">Your EcoScore</p><p className="text-2xl font-bold text-green-700">{currentEcoScore}/100</p></div></div>
        </header>
        <div className="flex gap-6 border-b pb-2 mb-6">
          <button onClick={()=>setActiveTab("dashboard")} className={`font-medium pb-2 ${activeTab==="dashboard" ? "border-b-2 border-green-600 text-green-600" : "text-gray-500"}`}>Dashboard</button>
          <button onClick={()=>setActiveTab("calculator")} className={`font-medium pb-2 ${activeTab==="calculator" ? "border-b-2 border-green-600 text-green-600" : "text-gray-500"}`}>Emission Calculator</button>
        </div>

        {activeTab==="dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-sm">Total Emissions</CardTitle><Shield className="h-4 w-4 text-green-500" /></div></CardHeader><CardContent><div className="text-2xl font-bold">{emissionData.length>0 ? emissionData[emissionData.length-1].total.toFixed(1) : "0.0"} kg</div><p className="text-xs text-gray-500">CO₂ equivalent</p></CardContent></Card>
              <Card><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-sm">Avg. Weekly</CardTitle><Clock className="h-4 w-4 text-blue-500" /></div></CardHeader><CardContent><div className="text-2xl font-bold">{(emissionData.reduce((s,e)=>s+e.total,0)/ (emissionData.length||1)).toFixed(1)} kg</div><p className="text-xs text-gray-500">CO₂ equivalent</p></CardContent></Card>
              <Card><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-sm">EcoScore</CardTitle><Users className="h-4 w-4 text-purple-500" /></div></CardHeader><CardContent><div className="text-2xl font-bold">{currentEcoScore}/100</div></CardContent></Card>
              <Card><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-sm">Suggestions</CardTitle><Heart className="h-4 w-4 text-red-500" /></div></CardHeader><CardContent><div className="text-2xl font-bold">4</div></CardContent></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card><CardHeader><CardTitle>Emissions Over Time</CardTitle><CardDescription>Your carbon footprint trend</CardDescription></CardHeader><CardContent className="h-80"><ResponsiveContainer width="100%" height="100%"><LineChart data={emissionData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip formatter={(v:any)=>[`${v} kg`,'Emissions']} /><Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
              <Card><CardHeader><CardTitle>EcoScore Progress</CardTitle></CardHeader><CardContent className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={[{date:'now',score:currentEcoScore}]}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis domain={[0,100]} /><Tooltip /><Bar dataKey="score" fill="#10b981" /></BarChart></ResponsiveContainer></CardContent></Card>
            </div>

            <Card><CardHeader><CardTitle>Sustainable Suggestions</CardTitle><CardDescription>Ways to reduce your carbon footprint</CardDescription></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="border p-4 rounded-lg hover:shadow"><h3 className="font-semibold text-green-700">Use Public Transit</h3><p className="text-sm text-gray-600 mt-1">Switch to public transportation for your daily commute to reduce emissions by up to 40%</p><span className="mt-2 inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">40% impact</span><Button className="mt-3 border border-green-600 text-green-600">Implement</Button></div><div className="border p-4 rounded-lg hover:shadow"><h3 className="font-semibold text-green-700">Install LED Bulbs</h3><p className="text-sm text-gray-600 mt-1">Replace traditional bulbs with LED alternatives to reduce energy consumption by 75%</p><span className="mt-2 inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">25% impact</span><Button className="mt-3 border border-green-600 text-green-600">Implement</Button></div></CardContent></Card>
          </div>
        )}

        {activeTab==="calculator" && (
          <div className="space-y-8">
            <Card><CardHeader><CardTitle>Calculate Your Carbon Footprint</CardTitle></CardHeader><CardContent className="space-y-6"><div><h3 className="font-medium mb-2">Transport</h3><Label>Transport Mode</Label><Select value={transportMode} onValueChange={setTransportMode}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="car">Car</SelectItem><SelectItem value="bus">Bus</SelectItem><SelectItem value="bike">Bicycle</SelectItem><SelectItem value="walk">Walking</SelectItem></SelectContent></Select><Label className="mt-2">Distance (km)</Label><Input type="number" value={distance} onChange={(e:any)=>setDistance(e.target.value)} placeholder="Enter distance" /></div><div><h3 className="font-medium mb-2">Energy Usage</h3><Label>Electricity (kWh)</Label><Input type="number" value={energyUsage} onChange={(e:any)=>setEnergyUsage(e.target.value)} placeholder="Enter kWh" /></div><div><h3 className="font-medium mb-2">Food Consumption</h3><Label>Diet Type</Label><Select value={dietType} onValueChange={setDietType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="vegan">Vegan</SelectItem><SelectItem value="vegetarian">Vegetarian</SelectItem><SelectItem value="mixed">Mixed Diet</SelectItem><SelectItem value="meat-heavy">Meat Heavy</SelectItem></SelectContent></Select></div><Button className="w-full bg-green-600 text-white" onClick={calculateEmissions} disabled={!distance || !energyUsage}>Calculate Emissions</Button></CardContent></Card>
            {emissionData.length > 0 && (<Card><CardHeader><CardTitle>Your Latest Emission Results</CardTitle></CardHeader><CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4"><div className="bg-green-50 p-4 rounded-lg text-center"><p className="text-sm text-gray-600">Transport</p><p className="text-xl font-bold text-green-700">{emissionData[emissionData.length-1].transport.toFixed(1)} kg</p></div><div className="bg-blue-50 p-4 rounded-lg text-center"><p className="text-sm text-gray-600">Energy</p><p className="text-xl font-bold text-blue-700">{emissionData[emissionData.length-1].energy.toFixed(1)} kg</p></div><div className="bg-purple-50 p-4 rounded-lg text-center"><p className="text-sm text-gray-600">Food</p><p className="text-xl font-bold text-purple-700">{emissionData[emissionData.length-1].food.toFixed(1)} kg</p></div><div className="bg-gray-50 p-4 rounded-lg text-center"><p className="text-sm text-gray-600">Total</p><p className="text-xl font-bold text-gray-700">{emissionData[emissionData.length-1].total.toFixed(1)} kg</p></div></CardContent></Card>)}
          </div>
        )}

      </div>
    </div>
  );
}
