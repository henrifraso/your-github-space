// afterSign hook do electron-builder.
// Recebe o .app já assinado e manda pra Apple notarizar.
// A Apple valida em ~5-15min e marca o app como "approved" no Gatekeeper.

const { notarize } = require('@electron/notarize');
const path = require('path');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;

  if (electronPlatformName !== 'darwin') {
    return;
  }

  if (!process.env.APPLE_ID || !process.env.APPLE_APP_SPECIFIC_PASSWORD || !process.env.APPLE_TEAM_ID) {
    console.log('[notarize] secrets ausentes — pulando notarização (build local sem assinatura)');
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = path.join(appOutDir, `${appName}.app`);

  console.log(`[notarize] iniciando notarização de ${appPath}`);
  console.log(`[notarize] Apple ID: ${process.env.APPLE_ID}`);
  console.log(`[notarize] Team ID: ${process.env.APPLE_TEAM_ID}`);

  await notarize({
    tool: 'notarytool',
    appPath,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID,
  });

  console.log(`[notarize] ${appName}.app notarizado com sucesso`);
};
