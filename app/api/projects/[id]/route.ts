import { fetchProjectById } from "@/lib/data/projects"
import { jsonError, jsonOk } from "@/lib/api/http"

type RouteContext = {
  params: { id: string } | Promise<{ id: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const params = await Promise.resolve(context.params)
  const projectId = decodeURIComponent(params.id || "")
  const { data, error } = await fetchProjectById(projectId)

  if (error) {
    return jsonError(error, 404)
  }

  return jsonOk({ data })
}
