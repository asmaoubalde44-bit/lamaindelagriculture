# 🌾 Guide Pratique : Comment Ajouter de Nouvelles Récoltes & Photos

Voici **2 méthodes faciles** pour mettre à jour le site lorsque vous avez de nouvelles récoltes ou de nouvelles photos du champ à présenter.

---

## ⚡ Méthode 1 : Directement depuis le site (Bouton "+ Ajouter une récolte")

Un bouton **`🌾 + Ajouter une récolte`** a été intégré sur la page **Galerie**.

### Comment faire :
1. Allez sur la page **Galerie**.
2. Cliquez sur le bouton rouge **`🌾 + Ajouter une récolte`**.
3. Remplissez le petit formulaire :
   - **Nom de la récolte** *(ex: "Grande Récolte de Piments Rouges d'Août")*
   - **Catégorie** *(ex: Nos Récoltes)*
   - **Image** *(ex: `images/piments.jpeg` ou le nom de votre nouvelle photo)*
   - **Info / Quantité** *(ex: "100 sacs disponibles à Vélingara")*
4. Cliquez sur **Publier sur le site**. La nouvelle récolte s'affiche automatiquement !
5. *(Optionnel)* Cliquez sur **`📢 Diffuser aussi sur WhatsApp`** pour envoyer instantanément l'annonce à vos clients et contacts sur WhatsApp !

---

## 💻 Méthode 2 : Ajouter une photo permanente via GitHub.com

Si vous voulez ajouter une nouvelle photo de manière définitive dans le code sur internet :

### Étape 1 : Ajouter la photo
1. Connectez-vous sur votre dépôt : [github.com/asmaoubalde44-bit/lamaindelagriculture](https://github.com/asmaoubalde44-bit/lamaindelagriculture)
2. Entrez dans le dossier **`images`**.
3. Cliquez sur **Add file ➔ Upload files**, glissez votre nouvelle photo *(ex: `nouvelle-recolte.jpeg`)* et validez en cliquant sur **Commit changes**.

### Étape 2 : Lier la photo dans la galerie
1. Ouvrez le fichier **`galerie.html`** sur GitHub.
2. Cliquez sur l'icône **Crayon ✏️** (Modifier).
3. Ajoutez ce petit bloc à l'endroit de votre choix :
```html
<div class="gallery-item" data-category="recoltes">
  <img src="images/votre-nouvelle-photo.jpeg" alt="Nouvelle Récolte">
  <div class="gallery-caption">Votre nouvelle récolte</div>
</div>
```
4. Cliquez sur **Commit changes** (Enregistrer).
5. GitHub remettra le site à jour automatiquement en 30 secondes !
