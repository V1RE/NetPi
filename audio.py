import os
import pafy
import time
from dateutil import parser

x = raw_input("Alarmtime: ")
alarmtime = parser.parse(x)
curtime = parser.parse(time.strftime("%H:%M:%S %d-%m-%y"))
y = raw_input("Youtube url: ")
vid = pafy.new(y)

print alarmtime
print curtime
print vid.title

os.system("rm -rf alert.*")

audio = vid.getbestaudio()
filename = audio.download(filepath="alarm." + audio.extension)

while True:
    if alarmtime == parser.parse(time.strftime("%H:%M:%S %d-%m-%y")):
        os.system("mplayer " + filename)
        break
    time.sleep(1)
