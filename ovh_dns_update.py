import ovh
import sys

client = ovh.Client(
    endpoint='ovh-eu',
    application_key='2353f9ef8089c084',
    application_secret='cfffcd275586543e46c6a264348b2ef0',
    consumer_key='9e618b4f1c243511dfe56e03693b15d4',
)

zone = 'rpbey.fr'
subdomain = 'shenron'

try:
    # 1. Search for existing A records for shenron.rpbey.fr
    records = client.get(f'/domain/zone/{zone}/record', 
                        fieldType='A', 
                        subDomain=subdomain)
    
    if records:
        for record_id in records:
            print(f"Updating existing record {record_id}")
            client.put(f'/domain/zone/{zone}/record/{record_id}', 
                      target='76.76.21.21')
    else:
        print(f"Creating new A record for {subdomain}.{zone}")
        client.post(f'/domain/zone/{zone}/record', 
                   fieldType='A', 
                   subDomain=subdomain, 
                   target='76.76.21.21')
    
    # 2. Refresh the zone
    print("Refreshing zone...")
    client.post(f'/domain/zone/{zone}/refresh')
    print("Success!")

except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
