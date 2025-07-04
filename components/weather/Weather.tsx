"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Cloud, Thermometer, Droplets, Wind, Eye } from "lucide-react"

interface WeatherData {
  name: string
  country: string
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  visibility: number
  icon: string
}

export default function WeatherApp() {
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const searchWeather = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!city.trim()) return

    setLoading(true)
    setError("")
    setWeather(null)

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch weather data")
      }

      setWeather(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Weather App</h1>
          <p className="text-gray-600">Get current weather information for any city</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Weather
            </CardTitle>
            <CardDescription>Enter a city name to get current weather information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={searchWeather} className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600 text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {weather && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {weather.name}, {weather.country}
                </span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {Math.round(weather.temperature)}°C
                </Badge>
              </CardTitle>
              <CardDescription className="flex items-center gap-2 text-lg">
                <Cloud className="h-5 w-5" />
                {weather.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Thermometer className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Temperature</p>
                    <p className="font-semibold">{Math.round(weather.temperature)}°C</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Droplets className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Humidity</p>
                    <p className="font-semibold">{weather.humidity}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Wind className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Wind Speed</p>
                    <p className="font-semibold">{weather.windSpeed} m/s</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg md:col-span-3">
                  <Eye className="h-6 w-6 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Visibility</p>
                    <p className="font-semibold">{(weather.visibility / 1000).toFixed(1)} km</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
