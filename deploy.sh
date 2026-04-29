#!/bin/bash
set -e

SCOPE="smith4"
ALIAS="os1app.vercel.app"

echo "→ deploy em produção..."
OUTPUT=$(vercel --prod --yes --scope "$SCOPE" 2>&1)
echo "$OUTPUT" | grep -E "ready|Error|Production|Aliased" | head -5

PREVIEW_URL=$(echo "$OUTPUT" | grep -o 'your-github-space-[a-z0-9]*-smith4\.vercel\.app' | head -1)

if [ -z "$PREVIEW_URL" ]; then
  echo "✗ não conseguiu extrair URL do deploy"
  exit 1
fi

echo "→ apontando $ALIAS para $PREVIEW_URL..."
vercel alias "$PREVIEW_URL" "$ALIAS" --scope "$SCOPE"

echo "✓ https://$ALIAS atualizado"
