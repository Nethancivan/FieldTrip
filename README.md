# FieldTrip Expense Snapshot

FieldTrip Expense Snapshot is a client-side GOVIETNAMEZE utility for creating a branded **Phiếu thực chi PDF** from fieldtrip expense details and evidence photos. It is a receipt snapshot generator, not an accounting system, approval workflow, or legal verification tool.

## Technology Stack

- React
- Vite
- Tailwind CSS
- JavaScript with JSX
- `html-to-image` for rendering receipt blocks in the browser
- `jsPDF` for assembling and downloading the A4 PDF

## Local Setup

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Production Build

```bash
npm run build
```

The static output is generated in `dist/`.

## Static Deployment

### Vercel

1. Import the repository as a Vite project.
2. Use `npm run build` as the build command.
3. Use `dist` as the output directory.

### GitHub Pages

For a root domain or username site:

```bash
npm run build
```

For a repository subpath, build with a base path:

```bash
VITE_BASE_PATH=/your-repo-name/ npm run build
```

Then publish the `dist/` folder using GitHub Pages.

## Brand and Content Edits

- Place the 16:9 GOVIETNAMEZE logo at `public/assets/logo.png`. `public/logo.png` remains a fallback if the assets logo is missing.
- The interface, receipt preview, and exported PDF use Bricolage Grotesque.
- Edit employee names in `src/constants/employees.js`.
- Edit expense categories in `src/constants/categories.js`.
- Edit fieldtrip suggestions and fieldtrip codes in `src/constants/fieldtrips.js`.
- Brand colors and UI tokens are centralized in `src/styles/brand.css`.
- Interface text is centralized in `src/constants/copy.js`.

## VAT Behavior

The form includes `Số tiền đã bao gồm VAT 10%`.

- Checked: the entered amount is treated as the final amount.
- Unchecked: the app adds 10% VAT and rounds the final amount to whole VND.

The Phiếu thực chi preview and PDF only show the final `Số tiền`; they do not show the VAT checkbox or VAT state.

## Privacy

All form data, evidence photos, receipt rendering, and PDF generation remain on the user's device. The app does not use a backend, database, analytics, tracking, storage API, Google Drive API, or automatic browser persistence. Refreshing or closing the page clears the working record.

The app downloads the PDF directly through the browser. It does not upload the PDF to a server and does not automatically save anything to Google Drive or another third-party service.

## Record Created At vs Exported At

- `Record Created At` is frozen when the user generates the Phiếu thực chi snapshot.
- `Exported At` is refreshed immediately before each PDF download.
- Downloading the same generated receipt multiple times keeps the receipt ID, Record Created At value, and expense data unchanged.

## Current Limitations

- The app creates PDF files only.
- It does not upload to Google Drive, Google Sheets, or any internal system.
- It does not verify, approve, reconcile, or store expenses.
- HEIC is not accepted because browser support is inconsistent.
- Mobile Safari may open the generated PDF in a browser tab if direct download is restricted by the device.

## Browser Compatibility

The app is designed for iPhone Safari, Android Chrome, and modern desktop Chrome, Edge, Safari, and Firefox. PDF generation depends on browser canvas memory, so very large original photos are resized and compressed locally before being used in the receipt.
