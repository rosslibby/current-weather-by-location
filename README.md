# Location-based Weather Reporting
A high-performance weather dashboard built with Next.js, deployed in a hardened, private AWS environment.

## Secure Access Instructions
The application is hosted within a Private Subnet and is not accessible via the public internet. Access is restricted to authorized users via an encrypted VPN tunnel.

1. **VPN Setup:** Download the provided `.ovpn` configuration file and import it into your preferred VPN client (e.g., OpenVPN Connect).
2. **Authentication:** Authenticate using the provided credentials.
3. **Application URL:** Once connected to the VPN, visit the application at: [http://10.0.139.28:3000/](http://10.0.139.28:3000/)

## Architecture & Security

This deployment demonstrates a production-ready, air-aapped architecture.

- **VPC Isolation:** The application server resides in a private subnet with no Internet Gateway (IGW) access, shielding it from external scanning and attacks.
- **NAT Egress:** Outbound API calls to the OpenWeatherMap service are routed through a NAT Gateway, allowing the server to fetch data while remaining invisible to the public web.
- **Standalone Runtime:** Utilizes the Next.js standalone output for a minimized, immutable container-like execution environment.

## Local Development
If you wish to run the project locally for review:

- Clone the repository
- Install dependencies: `npm install`
- Create a `.env.local` file and add the following values:
```bash
OPENWEATHER_API_KEY={openweather_api_key}
OPENWEATHER_BASE_URL=https://api.openweathermap.org
GOOGLE_PLACES_API_KEY={google_places_api_key}
GOOGLE_PLACES_BASE_URL=https://places.googleapis.com/v1
```
- Run in development mode: `npm run dev`

## Usage Features
The application provides a flexible search interface for global weather data:

- **Multi-Format Search:** Supports City Names, Zip Codes, and Latitude/Longitude.
- **Smart Detection:** The search field automatically distinguishes between city names and zip codes.
- **Coordinate Toggle:** Use the button to the left of the input to switch to precise coordinate entry.
- **Keyboard-Optimized Autocomplete:**
  - Suggestions appear dynamically as you type.
  - Navigate suggestions with **Arrow Keys**.
  - Select a suggestion with the **Right Arrow** or **Tab** key.
