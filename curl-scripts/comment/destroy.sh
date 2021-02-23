
#reviews

API="http://localhost:4741"
URL_PATH="/comments"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request DELETE \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "comment": {
      "threadId": "'"${THREAD_ID}"'"
    }
  }'

echo
