// import { type NextRequest, NextResponse } from "next/server"

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams
//   const city = searchParams.get("city")

//   if (!city) {
//     return NextResponse.json({ error: "City parameter is required" }, { status: 400 })
//   }

//   const apiKey = process.env.OPENWEATHER_API_KEY

//   if (!apiKey) {
//     return NextResponse.json({ error: "OpenWeather API key is not configured" }, { status: 500 })
//   }

//   try {
//     const response = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`,
//     )

//     if (!response.ok) {
//       if (response.status === 404) {
//         return NextResponse.json({ error: "City not found" }, { status: 404 })
//       }
//       throw new Error(`OpenWeather API error: ${response.status}`)
//     }

//     const data = await response.json()

//     const weatherData = {
//       name: data.name,
//       country: data.sys.country,
//       temperature: data.main.temp,
//       description: data.weather[0].description,
//       humidity: data.main.humidity,
//       windSpeed: data.wind.speed,
//       visibility: data.visibility,
//       icon: data.weather[0].icon,
//     }

//     return NextResponse.json(weatherData)
//   } catch (error) {
//     console.error("Weather API error:", error)
//     return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
//   }
// }
