import { signifyService } from "@pages/background/services/signify";
import { userService } from "@pages/background/services/user";
import { getDomainFromUrl } from "@shared/utils";
import { IHandler } from "@config/types";

export async function handleCheckAgentConnection({
  sendResponse,
  url,
}: IHandler) {
  const isConnected = await signifyService.isConnected();
  sendResponse({ data: { isConnected, tabUrl: url } });
}

export async function handleDisconnectAgent({ sendResponse }: IHandler) {
  await signifyService.disconnect();
  sendResponse({ data: { isConnected: false } });
}

export async function handleConnectAgent({ sendResponse, data }: IHandler) {
  const resp = (await signifyService.connect(
    data.agentUrl,
    data.passcode
  )) as any;
  if (resp?.error) {
    // TODO: improve error messages
    // Current messages are not descrptive enough e.g
    // bran must be 21 characters
    // agent does not exist for controller <controller-id>
    // using custom error message for now instead of resp?.error?.message

    sendResponse({
      error: {
        code: 404,
        message: resp?.error?.message,
      },
    });
  } else {
    await userService.setPasscode(data.passcode);
    sendResponse({ data: { success: true } });
  }
}

export async function handleBootConnectAgent({ sendResponse, data }: IHandler) {
  const resp = (await signifyService.bootAndConnect(
    data.agentUrl,
    data.bootUrl,
    data.passcode
  )) as any;
  if (resp?.error) {
    sendResponse({
      error: {
        code: 404,
        message: resp?.error?.message,
      },
    });
  } else {
    await userService.setPasscode(data.passcode);
    sendResponse({ data: { success: true } });
  }
}

export async function handleGeneratePasscode({ sendResponse, data }: IHandler) {
  const passcode = signifyService.generatePasscode();
  sendResponse({ data: { passcode } });
}

export async function handleGetAuthData({
  sendResponse,
  tabId,
  url,
  data,
}: IHandler) {
  try {
    const resp = await signifyService.authorizeSelectedSignin({
      tabId: tabId!,
      signin: data.signin,
      origin: getDomainFromUrl(url!),
      config: data.config,
    });

    sendResponse({
      data: resp,
    });
  } catch (error: any) {
    sendResponse({
      error: { code: 503, message: error?.message },
    });
  }
}

export async function handleGetSessionInfo({
  sendResponse,
  tabId,
  url,
}: IHandler) {
  try {
    const resp = await signifyService.getSessionInfo({
      tabId: tabId!,
      origin: getDomainFromUrl(url!),
    });

    sendResponse({
      data: resp,
    });
  } catch (error: any) {
    sendResponse({
      error: { code: 503, message: error?.message },
    });
  }
}

export async function handleClearSession({
  sendResponse,
  tabId,
  url,
}: IHandler) {
  try {
    const resp = await signifyService.removeSessionInfo({
      tabId: tabId!,
      origin: getDomainFromUrl(url!),
    });

    sendResponse({
      data: resp,
    });
  } catch (error: any) {
    sendResponse({
      error: { code: 503, message: error?.message },
    });
  }
}