@component('mail::message')
# Donation {{ $statusText }}

Your donation **{{ $donation->title }}** has been **{{ ucfirst($action) }}**.

**Details:**
- **Quantity:** {{ $donation->quantity }}
- **Pickup Address:** {{ $donation->pickup_address }}
- **Expiry Date:** {{ \Carbon\Carbon::parse($donation->expiry_date)->format('d M, Y') }}

@component('mail::button', ['url' => url('/donations/'.$donation->id)])
View Donation Details
@endcomponent

Thank you for supporting the community! ❤️

— Food Donation Team
@endcomponent
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        color: #333;
    }
    .button {
        background-color: #28a745;
        color: white;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
    }
    .button:hover {
        background-color: #218838;
    }
    h1 {
        color: #007bff;
    }
    p {
        font-size: 16px;
    }
</style>