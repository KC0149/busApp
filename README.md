# Bus Application

The Bus Application is a web application developed using React.js with API integration. Designed with CSS and Tailwind CSS, and utilizing both JavaScript and TypeScript, the application provides users with an intuitive interface to explore bus routes based on vehicle reference, published line selections, or axis type. By fetching data from designated APIs, the application dynamically presents route information on a map with various functionalities, ensuring a seamless experience for users accessing bus routes and related details.

![image](https://github.com/KC0149/busApp/assets/115627529/7780a058-866f-4140-9ac0-0246d8de6b32)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)

## Installation

### Frontend (javascript)

To install and run the Bus Application locally, follow these steps:

1. Clone the Bus Application repository to your local machine:

```

git clone https://github.com/KC0149/busApp.git
```

2. Navigate to the busApp javascript directory:

```
cd busApp-react

```

3. Install dependencies:

```
npm install
```

4. Start the development server:

```
npm run dev
```

### Frontend (typescript)

To install and run the Bus Application locally, follow these steps:

1. Clone the Bus Application repository to your local machine:

```

git clone https://github.com/KC0149/busApp.git

```

2. Navigate to the busApp typescript directory:

```
cd busApp-typescript

```

3. Install dependencies:

```
npm install
```

4. Start the development server:

```
npm run dev
```

11. Open your web browser and navigate to `http://localhost:5173` to access the Bus application.

## Usage

Once the Bus Application is running, users can perform the following actions:

- **Explore Bus Routes**: Users can search for bus routes based on vehicle reference or published line selections. Additionally, users can select road types to search by different axis types.

- **View Route Details**: Users can view detailed information about each bus route, including stops, schedules, and estimated arrival times.

- **Toggle Between routes**: Toggle between original route and another showing the route adjusted to follow roads.

- **Interactive Map**: The application features an interactive map that dynamically displays bus routes and related details. Users can click on the routes to access more information.

- **API Integration**: Bus route data is fetched from designated APIs, ensuring up-to-date and accurate information for users.

## Features

The Bus Application offers the following capabilities:

- **Search and Filter Routes**: Easily find bus routes by vehicle reference or published line selections. Filter routes by road types for specific axis types.
- **Route Information**: Access comprehensive details about each bus route, including stops, schedules, and estimated arrival times.
- **Interactive Map Display**: Visualize bus routes dynamically on an interactive map. Click on routes to explore additional information.

- **Real-time Data**: Fetch bus route data from designated APIs, ensuring up-to-date and accurate information for users.

- **Search History**: Retain the top 5 search history for easy access to recent searches.

- **Progress Bar**: Display a progress bar when loading data to provide visual feedback to users while calling the API in the backend.

- **Toggle Between GeoJSON**: Toggle between two GeoJSON representations - one showing the original route and another showing the route adjusted to follow roads.

- **React Window for Virtualization**: Utilize React Window for efficient virtualization of large lists, optimizing performance when displaying large amounts of data.
