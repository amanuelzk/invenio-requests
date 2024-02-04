// This file is part of InvenioRequests
// Copyright (C) 2022 CERN.
//
// Invenio RDM Records is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import { i18next } from "@translations/invenio_requests/i18next";
import React, { useEffect, useState } from "react";
import { Button} from "semantic-ui-react";
import { http } from "react-invenio-forms";

let status = null;
let requestValue;
export const SaveButton = (props) => (
  <Button
    icon="save"
    labelPosition="left"
    positive
    size="mini"
    content={i18next.t("Save")}
    {...props}
  />
);

export const RequestDeclineButton = ({
  onClick,
  loading,
  ariaAttributes,
  size,
  className,
}) => {
  return (
    <>
      {status === null && (
        <Button
          icon="cancel"
          style={{ display: status === null ? "block" : "none" }}
          labelPosition="left"
          content={i18next.t("Decline")}
          onClick={onClick}
          loading={loading}
          disabled={loading}
          negative
          size={size}
          className={className}
          {...ariaAttributes}
        />
      )}
    </>
  );
};

export const Request = ({ request }) => {
  requestValue = request;

  return null;
};

export const RequestAcceptButton = ({
  onClick,
  requestType,
  loading,
  ariaAttributes,
  size,
  className,
  // Make sure requestValue is passed as a prop
}) => {
  const [countAStatus, setCountAStatus] = useState(undefined);
  useEffect(() => {
    requestContent();
  });
  const requestContent = async () => {
    try {
      const resp = await http.post(
        "https://127.0.0.1:5000/api/records/request_num",
        requestValue,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const requests = resp.data;
      const count = requests.status.reduce((count, item) => {
        return item.status === "A" ? count + 1 : count;
      }, 0);

      setCountAStatus(count);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const requestwaitList = async () => {
    try {
      const data = {
        status: "A",
        id: requestValue.id,
      };

      const resp = await http.post(
        "https://127.0.0.1:5000/api/records/request_list",
        data,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (requestType === "community-submission" && countAStatus < 1) {
    return (
      <>
        <Button
          icon="checkmark"
          labelPosition="left"
          content="Accept"
          onClick={requestwaitList}
          positive
          loading={loading}
          disabled={loading}
          size={size}
          className={className}
          {...ariaAttributes}
          href="https://127.0.0.1:5000/me/communities"
        />
      </>
    );
  } else {
    const buttonText =
      requestType === "community-submission" ? "Accept and publish" : "Accept";

    return (
      <Button
        icon="checkmark"
        labelPosition="left"
        content={buttonText}
        onClick={onClick}
        positive
        loading={loading}
        disabled={loading}
        size={size}
        className={className}
        {...ariaAttributes}
      />
    );
  }
};

export const CancelButton = React.forwardRef((props, ref) => {
  useEffect(() => {
    ref?.current?.focus();
  }, []);

  return (
    <>
      {status !== "A" && (
        <Button
          ref={ref}
          icon="cancel"
          labelPosition="left"
          content={i18next.t("Cancel")}
          size="mini"
          {...props}
        />
      )}
    </>
  );
});

export const RequestCancelButton = ({
  onClick,
  loading,
  ariaAttributes,
  size,
  content = i18next.t("Cancel request"),
  className,
  negative = true,
}) => {
  return (
    <></>
    // <Button
    //   icon="cancel"
    //   labelPosition="left"
    //   content={content}
    //   onClick={onClick}
    //   loading={loading}
    //   disabled={loading}
    //   size={size}
    //   negative={negative}
    //   className={className}
    //   {...ariaAttributes}
    // />
  );
};

export const RequestSubmitButton = ({
  onClick,
  loading,
  ariaAttributes,
  size,
  className,
}) => {
  return (
    <Button
      icon="unlock alternate"
      labelPosition="left"
      content={i18next.t("Request access")}
      onClick={onClick}
      positive
      loading={loading}
      disabled={loading}
      size={size}
      className={className}
      {...ariaAttributes}
    />
  );
};
