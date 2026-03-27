import { execSync } from "child_process";

interface NewPostOptions {
  title: string;
}

function parseArgs(): NewPostOptions {
  const args = process.argv.slice(2);

  let title = "";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--title" || args[i] === "-t") {
      title = args[i + 1];
      i++;
    }
  }

  if (!title) {
    console.error('Usage: pnpm new-post --title "Your Title"');
    console.error('  or: pnpm new-post -t "Your Title"');
    process.exit(1);
  }

  return { title };
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function generateDateParts(): { year: string; month: string; day: string } {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return { year, month, day };
}

function main() {
  const { title } = parseArgs();

  const slug = generateSlug(title);
  const { year, month, day } = generateDateParts();
  const filename = `${month}${day}-${slug}.md`;
  const filePath = `content/posts/${year}/${filename}`;

  console.log(`Creating new post: ${filePath}`);
  console.log(`Title: ${title}`);

  try {
    execSync(`hugo new content ${filePath}`, { stdio: "inherit" });
    console.log(`\n✅ Successfully created: ${filePath}`);
  } catch (error) {
    console.error("❌ Failed to create post:", error);
    process.exit(1);
  }
}

main();
