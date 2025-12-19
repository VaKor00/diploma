<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    @vite('resources/js/index.jsx')
</head>

<script src="https://api-maps.yandex.ru/v3/?apikey=8735c427-2256-459f-9e73-3373945da236&lang=ru_RU"></script>

<body>
    @inertia
    
</body>
</html>
