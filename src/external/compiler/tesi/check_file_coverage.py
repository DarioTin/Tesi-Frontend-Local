import os
import subprocess
import shutil
from bs4 import BeautifulSoup as bs

def getPaths():
    root_path = os.path.abspath(os.getcwd()) # Prendo il path del root
    original_project = root_path + '/original-module'
    refactored_project = root_path + '/refactored-module'
    aggregate_project = root_path + '/aggregate-reports'
    return (root_path, original_project, refactored_project, aggregate_project)

def runTests():
    os.chdir(root_path)
    proc = subprocess.Popen(["mvn", "clean", "verify"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True) # Effettuo il test
    proc.wait()
    proc.communicate()

def saveTestResults(num):
    if(num == "1"):
        shutil.copy(original_project + '/target/site/jacoco/index.html' , root_path)
    if(num == "2"):
        shutil.copy(refactored_project + '/target/site/jacoco/index.html' , root_path)
    if(num == "3"):
        shutil.copy(aggregate_project + '/target/site/jacoco-aggregate/index.html' , root_path)
    os.rename("index.html","index"+ num +".html") # Salvo il test nella root

def extractPercentages(file):
    with open(file, "r") as f:
        contents = f.read()
        soup = bs(contents, "html.parser")
        table = soup.find("table",{"class":"coverage"})
        tfoot = table.find("tfoot")
        line_coverage = tfoot.find_all("td",class_="ctr2")[0].get_text()
        branch_coverage = tfoot.find_all("td",class_="ctr2")[1].get_text()
    return line_coverage, branch_coverage

def getFileCoverage(num):
    os.chdir(root_path)
    if(os.path.isfile("index" + num + ".html")):
        line_coverage, branch_coverage = extractPercentages("index" + num + ".html")
        return (line_coverage, branch_coverage)
       
def extractPercentage(line_coverage, branch_coverage):
    line_coverage = line_coverage.replace("%","")
    branch_coverage = branch_coverage.replace("%","")
    if line_coverage == "n/a":
        line_coverage = 0
    if branch_coverage == "n/a":
        branch_coverage = 0
    return (int(line_coverage),int(branch_coverage))

def checkTestsCoverage(first_line_percentage, first_branch_percentage, second_line_percentage, second_branch_percentage):
    if(abs(first_line_percentage - second_line_percentage) > 5):
        return False
    if(abs(first_branch_percentage - second_branch_percentage) > 5):
        return False
    return True

def checkSimilarity(first_line_percentage, first_branch_percentage, second_line_percentage, second_branch_percentage, aggregate_line_percentage, aggregate_branch_percentage):
    #if(checkTestsCoverage(first_line_percentage, first_branch_percentage, second_line_percentage, second_branch_percentage) == True): # Verifichiamo che le due coperture non sono troppo diverse
    if(first_line_percentage == second_line_percentage and first_line_percentage == aggregate_line_percentage): # Verifichiamo che, se le due coperture sono uguali allora devono coincidere con l'aggregato
        return True
    #if(first_branch_coverage == second_branch_coverage and first_branch_coverage == aggregate_branch_coverage): # Verifichiamo che, se le due coperture sono uguali allora devono coincidere con l'aggregato
    #    return True
    else:
        first_difference = aggregate_line_percentage - first_line_percentage
        second_difference = aggregate_line_percentage - second_line_percentage
        line_difference = abs(first_difference - second_difference) # Verifichiamo che, se le due coperture sono diverse, allora verifichiamo di quanto sono diverse
        print("PERCENTAGE DIFFERENCE : " + str(line_difference))
        if(line_difference > 5):
            return False
        #first_difference = aggregate_branch_percentage - first_branch_percentage
        #second_difference = aggregate_branch_percentage - second_branch_percentage
        #branch_difference = abs(first_difference - second_difference)
        #if(branch_difference > 5):
        #    return False
    return True 

def getFileName():
    os.chdir(original_project + '/src/main/java/org/example')
    arr = os.listdir()
    return arr[0].replace(".java","")


def editCsvFile():
    exercise = getFileName()
    os.chdir(root_path)
    with open('test_template.csv', 'r') as file:
        filedata = file.read()
    filedata = filedata.replace('1',exercise + 'Test.java')
    filedata = filedata.replace('2',exercise + '.java')

    if(os.path.isfile('test.csv')):
        os.remove('test.csv')
    with open('test.csv','w') as file:
        file.write(filedata)

root_path, original_project, refactored_project, aggregate_project = getPaths()
editCsvFile()
runTests()
saveTestResults("1")
saveTestResults("2")
saveTestResults("3")
first_line_coverage, first_branch_coverage = getFileCoverage("1")
second_line_coverage, second_branch_coverage = getFileCoverage("2")
aggregate_line_coverage, aggregate_branch_coverage = getFileCoverage("3")
first_line_percentage, first_branch_percentage = extractPercentage(first_line_coverage,first_branch_coverage)
second_line_percentage, second_branch_percentage = extractPercentage(second_line_coverage, second_branch_coverage)
aggregate_line_percentage, aggregate_branch_percentage = extractPercentage(aggregate_line_coverage, aggregate_branch_coverage)
print(checkSimilarity(first_line_percentage, first_branch_percentage, second_line_percentage, second_branch_percentage, aggregate_line_percentage, aggregate_branch_percentage))
#print(checkTestsCoverage(first_line_coverage, first_branch_coverage, second_line_coverage, second_branch_coverage))
#restoreTestFile()

