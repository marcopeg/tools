import { useCallback, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useAuth } from "./use-auth";

const GET_ACCOUNT_SETTINGS = gql`
  query getAccountSettings {
    account_settings(where: { key: { _in: ["learn_lang", "known_lang"] } }) {
      value
      key
    }
  }
`;

const SET_ACCOUNT_SETTING = gql`
  mutation setAccountSettings(
    $key: String = "learn_lang"
    $value: json = "sv"
  ) {
    insert_account_settings_one(
      object: { key: $key, value: $value }
      on_conflict: { constraint: settings_pkey, update_columns: value }
    ) {
      key
      created_at
      updated_at
      value
    }
  }
`;

interface AccountSetting {
  key: string;
  value: JSON;
}

interface AccountSettingsApi {
  hasLoaded: boolean;
  needOnboarding: boolean;
  getValue: <T = any>(key: string) => T | undefined;
  setValue: (key: string, value: string | JSON) => Promise<any>;
}

export const useAccountSettings = (): AccountSettingsApi => {
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { data, error } = useQuery(GET_ACCOUNT_SETTINGS, {
    skip: !isAuthenticated,
  });
  const [setAccountSetting] = useMutation(SET_ACCOUNT_SETTING, {
    refetchQueries: [{ query: GET_ACCOUNT_SETTINGS }],
    awaitRefetchQueries: true,
  });

  const getValue = useCallback(
    <T>(key: string): T | undefined => {
      return data?.account_settings.find(
        (setting: AccountSetting) => setting.key === key
      )?.value as T;
    },
    [data]
  );

  const setValue = useCallback((key: string, value: string | JSON) => {
    const _value = typeof value === "string" ? JSON.parse(`"${value}"`) : value;

    return setAccountSetting({
      variables: {
        key,
        value: _value,
      },
    });
  }, []);

  // Automatically set the UI language to the user's known language
  useEffect(() => {
    if (!data) return;
    i18n.changeLanguage(getValue("known_lang"));
  }, [data]);

  return {
    hasLoaded: data || error,
    needOnboarding: !getValue("learn_lang") || !getValue("known_lang"),
    getValue,
    setValue,
  };
};
