# Rural Healthcare App (Prototype)

A React + TypeScript prototype for rural healthcare access with:
- Multilingual UI (Zulu, Xhosa, Afrikaans, Sotho, Swahili, French, Portuguese)
- Text and voice translation demo
- Patient dashboard with quick actions
- Clinic locator, appointment booking, telemedicine, records, education
- Supabase integration for auth and demo data

## Tech
- React 18, TypeScript, CRA
- TailwindCSS + shadcn/radix UI + lucide icons
- Supabase JS v2

## Run locally
```powershell
# install deps
npm install

# start dev server
npm start
```

If you see missing env values, create `src/utils/supabase/info.ts` or set `.env` as per your Supabase project.

## Demo script
- Switch language from the top bar to show live translation.
- Open Translation Demo to try text/voice terms: doctor, patient, appointment, symptoms, medicine, emergency, clinic, consultation, records, education.
- Navigate Telemedicine, Clinic Locator → Booking, Records, Education; use Back button.

## Deploy
- Any static host (Netlify, Vercel) works with CRA build.

## License
MIT
