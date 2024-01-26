import { useState, useEffect } from "react";
import { configService } from "@pages/background/services/config";
import { Button, Text } from "@components/ui";
import { isValidUrl } from "@pages/background/utils";

interface IConfig {
  afterSetUrl: () => void;
}

export function Config(props: IConfig): JSX.Element {
  const [vendorUrl, setVendorUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const getVendorUrl = async () => {
    const _vendorUrl = await configService.getUrl();
    setVendorUrl(_vendorUrl);
  };

  useEffect(() => {
    getVendorUrl();
  }, []);

  const onBlurUrl = () => {
    if (!vendorUrl || !isValidUrl(vendorUrl)) {
      setUrlError("Enter a valid url");
    } else {
      setUrlError("");
    }
  };

  const handleSetUrl = async () => {
    let hasError = false;
    if (!vendorUrl || !isValidUrl(vendorUrl)) {
      setUrlError("Enter a valid url");
      hasError = true;
    }

    if (!hasError) {
      await configService.setUrl(vendorUrl);
      props.afterSetUrl();
    }
  };

  return (
    <>
      <div className="px-4 py-2">
        <Text className="text-sm font-bold" $color="heading">
          Agent Url:
        </Text>
        <input
          type="text"
          id="vendor_url"
          className={`border text-black text-sm rounded-lg block w-full p-2.5 ${
            urlError ? " text-red border-red" : ""
          } `}
          placeholder="Enter Keria url"
          required
          value={vendorUrl}
          onChange={(e) => setVendorUrl(e.target.value)}
          onBlur={onBlurUrl}
        />
        {urlError ? <p className="text-red">{urlError}</p> : null}
      </div>
      <div className="flex flex-row justify-center">
        <Button
          handleClick={handleSetUrl}
          className="text-white flex flex-row focus:outline-none font-medium rounded-full text-sm"
        >
          <p className="font-medium text-md">Save</p>
        </Button>
      </div>
    </>
  );
}
