export type LineResponse = {
  lineId: string;
  lineName: string;
  direction: string;
  isOutboundOnly: true;
  mode: string;
  lineStrings: string[];
  stations: [
    {
      routeId: 0;
      parentId: string;
      stationId: string;
      icsId: string;
      topMostParentId: string;
      direction: string;
      towards: string;
      modes: string[];
      stopType: string;
      stopLetter: string;
      zone: string;
      accessibilitySummary: string;
      hasDisruption: true;
      lines: [
        {
          id: string;
          name: string;
          uri: string;
          fullName: string;
          type: string;
          crowding: {
            passengerFlows: [
              {
                timeSlice: string;
                value: 0;
              },
            ];
            trainLoadings: [
              {
                line: string;
                lineDirection: string;
                platformDirection: string;
                direction: string;
                naptanTo: string;
                timeSlice: string;
                value: 0;
              },
            ];
          };
          routeType: "Unknown";
          status: "Unknown";
        },
      ];
      status: true;
      id: string;
      url: string;
      name: string;
      lat: 0.0;
      lon: 0.0;
    },
  ];
  stopPointSequences: [
    {
      lineId: string;
      lineName: string;
      direction: string;
      branchId: 0;
      nextBranchIds: [0];
      prevBranchIds: [0];
      stopPoint: [
        {
          routeId: 0;
          parentId: string;
          stationId: string;
          icsId: string;
          topMostParentId: string;
          direction: string;
          towards: string;
          modes: string[];
          stopType: string;
          stopLetter: string;
          zone: string;
          accessibilitySummary: string;
          hasDisruption: true;
          lines: [
            {
              id: string;
              name: string;
              uri: string;
              fullName: string;
              type: string;
              crowding: {
                passengerFlows: [
                  {
                    timeSlice: string;
                    value: 0;
                  },
                ];
                trainLoadings: [
                  {
                    line: string;
                    lineDirection: string;
                    platformDirection: string;
                    direction: string;
                    naptanTo: string;
                    timeSlice: string;
                    value: 0;
                  },
                ];
              };
              routeType: "Unknown";
              status: "Unknown";
            },
          ];
          status: true;
          id: string;
          url: string;
          name: string;
          lat: 0.0;
          lon: 0.0;
        },
      ];
      serviceType: "Regular";
    },
  ];
  orderedLineRoutes: [
    {
      name: string;
      naptanIds: string[];
      serviceType: string;
    },
  ];
};
