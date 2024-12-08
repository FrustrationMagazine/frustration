import { Resend } from "resend";
import fs from "fs";

const resend = new Resend("re_9PM9Gvjz_PMfunZbrcM68PBmANxhdiwQM");

const startingDateArg = process.argv[2];

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

resend.contacts
  .list({
    audienceId: "359cddaa-064c-4b5c-a919-6ef43549c4f7"
  })
  .then(({ data, error }) => {
    // ❌ Error
    if (error) {
      console.error("Error fetching emails:", error);
      process.exit(1);
    }

    // ✅ Success
    if (data) {
      let emails = data.data
        .filter(({ created_at }) => {
          if (startingDateArg) {
            if (!isValidDate(startingDateArg)) {
              console.error("Invalid date format");
              process.exit(1);
            }

            const startingDate = new Date(startingDateArg);
            startingDate.setHours(0, 0, 0, 0);

            return new Date(created_at) >= new Date(startingDate);
          }
          return true;
        })
        .map(({ email }) => email);

      // console.log("data", data);
      // Define the CSV file path
      const csvFilePath = "./emails.csv";

      // Create the CSV content
      const csvContent = "Email\n" + emails.join("\n");

      // Write the CSV content to the file
      fs.writeFile(csvFilePath, csvContent, (err) => {
        if (err) {
          console.error("Error writing to CSV file:", err);
        } else {
          console.log("CSV file has been written successfully:", csvFilePath);
        }
      });
    }
  });
