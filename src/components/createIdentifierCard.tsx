import { isValidElement, useState, useEffect } from "react";
import { Button } from "@components/ui";
import { hasWhiteSpace, removeWhiteSpace } from "@pages/background/utils";

export function CreateIdentifierCard(props): JSX.Element {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    setNameError(props.error);
  }, [props.error]);
  const onBlurName = () => {
    if (!name) {
      setNameError("Name can not be empty");
    } else {
      setNameError("");
    }
  };

  const handleRemoveWhiteSpace = () => {
    setName(removeWhiteSpace(name));
    setNameError("");
  };
  const onCreateIdentifier = async () => {
    let hasError = false;
    if (!name) {
      setNameError("Name can not be empty");
      hasError = true;
    } else if (hasWhiteSpace(name)) {
      setNameError(
        <div className="text-red mt-1">
          No white spaces allowed.{" "}
          <button
            className=" underline cursor-pointer"
            onClick={handleRemoveWhiteSpace}
          >
            click to remove
          </button>
        </div>
      );
      hasError = true;
    }

    if (!hasError) props.handleCreateIdentifier(name);
  };

  return (
    <>
      <div className=" max-w-xs m-4 flex flex-col gap-y-4">
        <div>
          <input
            type="text"
            id="vendor_url"
            className={`border text-black text-sm rounded-lg block w-full p-2.5 ${
              nameError ? " text-red border-red" : ""
            } `}
            placeholder="Enter unique name for identifier"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={onBlurName}
          />
          {nameError ? (
            isValidElement(nameError) ? (
              nameError
            ) : (
              <p className="text-red mt-1">{nameError}</p>
            )
          ) : null}
        </div>
        <div className=" flex flex-row justify-center mt-2">
          <Button
            handleClick={onCreateIdentifier}
            className="text-white flex flex-row font-medium rounded-full text-sm px-5 py-2"
          >
            <p className="font-medium text-md">Create</p>
          </Button>
        </div>
      </div>
    </>
  );
}
