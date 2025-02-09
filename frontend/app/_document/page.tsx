import Document, { Html, Head, Main, NextScript } from 'next/document';

console.log(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
  console.error("Google Maps API key is not available.");
}

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Google Maps API script */}
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
            async
            defer
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
