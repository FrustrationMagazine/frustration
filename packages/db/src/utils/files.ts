const fs = require("fs");
const fsPromises = require("fs").promises;

export function saveFile(data: any[], filePath: string) {
  fs.writeFile(filePath, JSON.stringify(data), "utf-8", (error: NodeJS.ErrnoException | null) => {
    if (error) {
      console.error(error);
    } else {
      console.log("💾 Data saved to file : ", filePath);
    }
  });
}

export async function readFile(filePath: string): Promise<any[]> {
  let data = await fsPromises.readFile(filePath, "utf-8", "binary");
  data = Buffer.from(data).toString();
  data = JSON.parse(data);
  return data;
}
