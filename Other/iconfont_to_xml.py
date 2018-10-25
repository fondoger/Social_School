import re

def parseLine(line: str):
    result = re.match(r'\.icon-(.*?):(?:.*?)"(.*?)"(?:.*?)', line)
    icon_name = "icon_" + result.group(1)
    icon_unicode = result.group(2).replace(r"\e", r"\ue")
    res = '<string name="{}">{}</string>'
    return res.format(icon_name, icon_unicode)




with open("icons.xml", "w") as out:
    out.write("<resources>\n")
    with open("iconfont.css", "r") as f:
        lines = f.readlines()
        for line in lines:
            if line.startswith(".icon-"):
                item = parseLine(line)
                print(item)
                out.write("    " + item + "\n")
    out.write("</resources>")