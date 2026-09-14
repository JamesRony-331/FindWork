from django.http import JsonResponse


def hello(request):
    return JsonResponse(
        {
            "code": 200,
            "message": "请求成功",
            "data": "Hello Django"
        },
        json_dumps_params={
            "ensure_ascii": False
        }
    )