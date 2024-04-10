import { ref } from 'vue'
const BaseApiUrl = 'https://gitlab.com/api/v4'

export const useFetch = async <T>(url: string, hasPagination: boolean = true) => {
  const data = ref<T>()
  const error = ref<null | string>(null)
  const nextPage = ref<null | string>('1')

  const getRequestUrl = (requestUrl: string, hasPagination: boolean) => {
    const baseUrl = BaseApiUrl + requestUrl
    if (hasPagination) {
      return baseUrl + `?page=${nextPage.value}&per_page=100`
    }
    return baseUrl
  }

  try {
    // Keep track of pagination chunks in case of paginated response
    let iterationBatch = []

    // Iterate over paginated APIs to the end, make only 1 request for non-paginated APIs
    do {
      const response = await fetch(getRequestUrl(url, hasPagination), {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GITLAB_ACCESS_TOKEN}`
        }
      })

      // Probably HTTP error, return message and break the loop
      if (!response.ok) {
        error.value = `HTTP error occurred: ${response.status}`
        break
      }

      const responseJson = await response.json()

      // No need to bother about pagination in this case, results are complete
      if (!hasPagination) {
        iterationBatch = responseJson
        break
      }

      // Push page to the batch
      iterationBatch.push(...responseJson)

      // Make use of response header to determine if there are next pages
      nextPage.value = response.headers.get('x-next-page')
    } while (nextPage.value !== null)

    // Finally update the actual data with completed batch
    data.value = iterationBatch
  } catch {
    // Unspecified error, just return the message
    error.value = 'Something went wrong.'
  }

  return { data, error }
}
