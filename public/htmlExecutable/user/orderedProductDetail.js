async function remove(P_id, P_qty, O_id) {
    console.log('clicked')
    const res = await fetch('/returnedItem', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            P_id, P_qty, O_id
        })
    })

    const result = await res.json()
    if (result.success) {
        location.reload();
    }
}