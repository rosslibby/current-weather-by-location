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

## Usage examples
|Type|Input Example|Result|
|-|-|-|
|**City Name**|`Austin, TX`|Displays current conditions for Austin, Texas.|
|**Zip Code**|`33131`|Displays weather for the Brickell neighborhood in Miami, FL|
|**Coordinates**|`40.71, -74.01`|Displays precise weather data for Lower Manhattan, NYC.|

## Connectivity Validation
As per the security requirements, the application is strictly isolated from the public internet.

- **Public Access Test:** Attempting to access [http://10.0.139.28:3000](http://10.0.139.28:3000) without an active VPN connection will result in a Connection Timeout.
- **Network Path:** Because the instance is located in a Private Subnet without a Public IP address or an Internet Gateway route for ingress, the application remains completely invisible to external scans and unauthorized traffic.
- **Internal DNS (Optional):** If using a private Route53 hosted zone, queries from outside the VPC will return NXDOMAIN, as the records are only resolvable within the authorized network environment.