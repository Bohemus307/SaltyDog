# Import Adafruit IO REST client.
from Adafruit_IO import *

# Set to your Adafruit IO key.
# Remember, your key is a secret,
# so make sure not to publish it when you publish this code!
ADAFRUIT_IO_KEY = 'aio_VWsQ41fhVMH6hk7vtpwFOfJkXvlZ'

# Set to your Adafruit IO username.
# (go to https://accounts.adafruit.com to find your username)
ADAFRUIT_IO_USERNAME = 'Bohemus307'

# Import library and create instance of REST client.
aio = Client('YOUR ADAFRUIT USER', 'YOUR ADAFRUIT IO KEY')

# Send the value 100 to a feed called 'Foo'.
aio.send('Foo', 100)

# Retrieve the most recent value from the feed 'Foo'.
# Access the value by reading the `value` property on the returned Data object.
# Note that all values retrieved from IO are strings so you might need to convert
# them to an int or numeric type if you expect a number.
data = aio.receive('Foo')
print('Received value: {0}'.format(data.value))

# Delete a feed
aio.delete_feed(response.key)
