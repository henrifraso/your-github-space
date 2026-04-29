#!/bin/bash
set -e

SCOPE="smith4"
ALIAS="os1app.vercel.app"
DEPLOY_DIR="/tmp/os1-deploy"

echo "→ build..."
npm run build

echo "→ copiando dist..."
rm -rf "$DEPLOY_DIR" && mkdir -p "$DEPLOY_DIR"
cp -r dist/* "$DEPLOY_DIR/"

echo "→ deploy em produção..."
OUTPUT=$(cd "$DEPLOY_DIR" && vercel --prod --yes --scope "$SCOPE" 2>&1)
echo "$OUTPUT" | grep -E "ready|Production|Aliased|Error" | head -5

PREVIEW_URL=$(echo "$OUTPUT" | grep -o 'os1-deploy-[a-z0-9]*-smith4\.vercel\.app' | head -1)

if [ -z "$PREVIEW_URL" ]; then
  echo "✗ não conseguiu extrair URL do deploy"
  echo "$OUTPUT"
  exit 1
fi

echo "→ apontando $ALIAS para $PREVIEW_URL..."
vercel alias "$PREVIEW_URL" "$ALIAS" --scope "$SCOPE"

echo "✓ https://$ALIAS atualizado"
