import * as express from "express";
// import fetch from "node-fetch";
const fetch = require("cross-fetch");

const app = express();
const PORT = 3000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.post("/getStatistics", async (req, res) => {
  try {
    const { variable, areaType, areas, years } = req.body;

    // Validate user inputs
    if (!variable || !areaType || !areas || !years) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const dataPromises = areas.map(async (area) => {
      // console.log(variable);
      // console.log(area);

      const response = await fetch(
        `https://data.ssb.no/api/v0/no/table/11342?var=${variable}&Region=${area}&Contents&BrukereKilder=S&format=json`
      );
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const json: any = await response.json();
      //   console.log(json);
      //   console.log(JSON.stringify(json, null, 2));

      // Find the variable in the API response and return its values
      const variableData = json.variables.find((v) => v.code === variable);
      console.log(variableData);
      return variableData ? variableData.values : [];
    });

    const data = await Promise.all(dataPromises);

    // Flatten the data array and calculate statistics
    const flatData = data.flat();
    const median = calculateMedian(flatData);
    const average = calculateAverage(flatData);
    const max = Math.max(...flatData);
    const min = Math.min(...flatData);

    res.json({ median, average, max, min });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function calculateMedian(data: number[]): number {
  const sortedData = data.sort((a, b) => a - b);
  const mid = Math.floor(sortedData.length / 2);
  if (sortedData.length % 2 === 0) {
    return (sortedData[mid - 1] + sortedData[mid]) / 2;
  } else {
    return sortedData[mid];
  }
}

function calculateAverage(data: number[]): number {
  const sum = data.reduce((acc, curr) => acc + curr, 0);
  return sum / data.length;
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
