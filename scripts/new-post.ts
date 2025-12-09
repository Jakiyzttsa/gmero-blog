import { execSync } from "child_process";

interface NewPostOptions {
  title: string;
  category: string;
}

function parseArgs(): NewPostOptions {
  const args = process.argv.slice(2);

  let title = "";
  let category = "";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--title" || args[i] === "-t") {
      title = args[i + 1];
      i++;
    } else if (args[i] === "--category" || args[i] === "-c") {
      category = args[i + 1];
      i++;
    }
  }

  if (!title || !category) {
    console.error(
      'Usage: pnpm new-post --title "Your Title" --category "category-name"'
    );
    console.error('  or: pnpm new-post -t "Your Title" -c "category-name"');
    process.exit(1);
  }

  return { title, category };
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function generateDatePrefix(): string {
  const now = new Date();
  const year = String(now.getFullYear()).slice(2); // Get last 2 digits of year
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function main() {
  const { title, category } = parseArgs();

  const slug = generateSlug(title);
  const datePrefix = generateDatePrefix();
  const filename = `${datePrefix}-${slug}.md`;
  const filePath = `content/posts/${category}/${filename}`;

  console.log(`Creating new post: ${filePath}`);
  console.log(`Title: ${title}`);
  console.log(`Category: ${category}`);

  try {
    execSync(`hugo new content ${filePath}`, { stdio: "inherit" });
    console.log(`\n✅ Successfully created: ${filePath}`);
  } catch (error) {
    console.error("❌ Failed to create post:", error);
    process.exit(1);
  }
}

main();
