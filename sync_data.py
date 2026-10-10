import csv,json,pathlib
p=pathlib.Path(__file__).resolve().parent
with (p/'sira_100_days_mock.csv').open(encoding='utf-8-sig',newline='') as f:
    rows=list(csv.DictReader(f))
data=[]
for r in rows:
    data.append(dict(id=int(r['ID'].split('-')[1]),title=r['Action'],axis=r['Axe'],owner=r['Responsable'],deadline=r['Échéance'],status=r['Statut'],progress=int(r['Avancement (%)']),blocker=r['Blocage / risque'],next=r['Prochaine étape'],evidence=r['Preuve attendue'],week=r['Cette semaine'].strip().lower()=='oui',type=r['Type']))
(p/'data.js').write_text('const MOCK_ACTIONS = '+json.dumps(data,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
print('Données synchronisées :',len(data),'actions')
