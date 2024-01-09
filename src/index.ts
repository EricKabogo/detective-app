import "reflect-metadata"
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger-spec';

import { Database } from "./data-source";
import { Detective } from "./entity/Detective";
import { Case } from "./entity/Case";
import { Evidence } from "./entity/Evidence";

const app = express();
const port = 3000;
app.use(express.json())

// Detectives

/**
 * @swagger
 * /detectives:
 *   get:
 *     summary: Gets all detectives
 *     responses:
 *       '200':
 *         description: A list of detectives
 *         content:
 *           application/json:
 *             example:
 *               [ {name: "Test Detective"} ]
 */
app.get('/detectives', async (req, res) => {
  const detectives = await Database.manager.find(Detective, {select: ["name"]})
  res.send(detectives);
});

/**
 * @swagger
 * /detectives/{detectiveId}:
 *   get:
 *     summary: Gets the details of one detective
 *     parameters:
 *       - in: path
 *         name: detectiveId
 *         required: true
 *         description: ID of the detective to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A list of detectives
 *         content:
 *           application/json:
 *             example:
 *               [ {id: "1", name: "Test Detective"} ]
 *       '404':
 *         description: Detective not found
 */
app.get('/detectives/:id', async (req, res) => {
  const detective = await Database.manager.findOne(Detective, {where: {id: req.params.id}})
  
  if (detective) {
    res.send(detective);
    return
  }

  res.status(404).send('Detective not found')
});

/**
 * @swagger
 * /detectives/{detectiveId}:
 *   put:
 *     summary: Updates the details of one detective
 *     parameters:
 *       - in: path
 *         name: detectiveId
 *         required: true
 *         description: ID of the detective to update
 *         schema:
 *           type: string
 *       - in: body
 *         name: name
 *         required: true
 *         description: The updated name of the detective
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A list of detectives
 *         content:
 *           application/json:
 *             example:
 *               [ {id: "1", name: "Test Detective"} ]
 *       '404':
 *         description: Detective not found
 */
app.put('/detectives/:id', async (req, res) => {
  const detective = await Database.manager.findOne(Detective, {where: {id: req.params.id}})
  
  if (!detective) {
    res.status(404).send('Detective not found')
    return
  }

  const updatedDetective = await Database.manager.save(Detective, { id: detective.id, name: req.body.name})

  res.send(updatedDetective)
});

// Cases

/**
 * @swagger
 * /cases:
 *   get:
 *     summary: Gets all cases
 *     responses:
 *       '200':
 *         description: A list of cases
 *         content:
 *           application/json:
 *             example:
 *               [
 *                   {
 *                      "id": 1,
 *                      "description": "Different case description",
 *                       "status": "closed"
 *                  },
 *                  {
 *                      "id": 2,
 *                      "description": "First Case",
 *                      "status": "open"
 *                  }
 *              ]
 */
app.get('/cases', async (req, res) => {
  const cases = await Database.manager.find(Case, {select: ["id", "description", "status"]})
  res.send(cases);
});

/**
 * @swagger
 * /cases/{caseId}:
 *   get:
 *     summary: Gets the details of one case
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         description: ID of the case to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: The details of the case in question
 *         content:
 *           application/json:
 *             example:
 *               {
 *                   "id": 1,
 *                   "description": "Different case description",
 *                    "status": "closed"
 *               }
 *       '404':
 *         description: Case not found
 */
app.get('/cases/:id', async (req, res) => {
  const caseFile = await Database.manager.findOne(Case, {where: {id: Number(req.params.id)}})
  
  if (caseFile) {
    res.send(caseFile);
    return
  }

  res.status(404).send('Case not found')
});

/**
 * @swagger
 * /cases:
 *   post:
 *     summary: Creates a new case
 *     parameters:
 *       - in: body
 *         name: description
 *         required: true
 *         description: The description of the case
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: The details of the created case
 *         content:
 *           application/json:
 *             example:
 *               {
 *                   "id": 1,
 *                   "description": "New case description",
 *                    "status": "open"
 *               }
 */
app.post('/cases', async (req, res) => {
  const detective = await Database.manager.findOneOrFail(Detective, {where: {id: 'first'}})

  const caseFile = await Database.manager.save(Case, {description: req.body.description, status: 'open', detectives: [detective]})

  res.send(caseFile);
});

/**
 * @swagger
 * /cases/{caseId}/evidences:
 *   post:
 *     summary: Creates a new evidence file
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         description: The case to attach the evidence to
 *         schema:
 *           type: string
 *       - in: body
 *         name: description
 *         required: true
 *         description: The description of the evidence
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: The details of the created evidence file
 *         content:
 *           application/json:
 *             example:
 *               {
 *                  "description": "Some evidence we found",
 *                 "type": "normal",
 *                 "case": {
 *                     "id": 1,
 *                     "description": "Different case description",
 *                     "status": "closed"
 *                 },
 *                 "id": 3
 *             }
 *       '404':
 *         description: Case not found
 */
app.post('/cases/:id/evidences', async (req, res) => {
  const caseFile = await Database.manager.findOne(Case, {where: {id: Number(req.params.id)}})

  if (!caseFile) {
    res.status(404).send('Case not found')
    return
  }
  const evidence = await Database.manager.save(Evidence, {description: req.body.description, type: 'normal', case: caseFile})
  
  res.send(evidence);
});

/**
 * @swagger
 * /cases/{caseId}:
 *   put:
 *     summary: Updates a case
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         description: The id of the case to update
 *         schema:
 *           type: string
 *       - in: body
 *         name: description
 *         required: true
 *         description: The description of the case
 *         schema:
 *           type: string
 *       - in: body
 *         name: status
 *         required: true
 *         description: The status of the case
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: The details of the updated case
 *         content:
 *           application/json:
 *             example:
 *               {
 *                   "id": 1,
 *                   "description": "New case description",
 *                    "status": "open"
 *               }
 *       '404':
 *         description: Case not found
 */
app.put('/cases/:id', async (req, res) => {
  const caseFile = await Database.manager.findOne(Case, {where: {id: Number(req.params.id)}})
  
  if (!caseFile) {
    res.status(404).send('Case not found')
    return
  }

  const updatedCaseFile = await Database.manager.save(Case, { id: caseFile.id, description: req.body.description, status: req.body.status})

  res.send(updatedCaseFile);
});

// Evidences

/**
 * @swagger
 * /cases:
 *   get:
 *     summary: Gets all evidences
 *     responses:
 *       '200':
 *         description: A list of evidences
 *         content:
 *           application/json:
 *             example:
 *               [
 *                   {
 *                      "id": 1,
 *                      "description": "Some evidence we found",
 *                      "type": "normal"
 *                  },
 *                  {
 *                      "id": 2,
 *                      "description": "Some other evidence we found",
 *                      "type": "normal"
 *                  }
 *              ]
 */
app.get('/evidences', async (req, res) => {
  const evidences = await Database.manager.find(Evidence, {select: ["id", "description", "type"]})
  res.send(evidences);
});


/**
 * @swagger
 * /evidences/{evidenceId}:
 *   get:
 *     summary: Gets the details of one evidence file
 *     parameters:
 *       - in: path
 *         name: evidenceId
 *         required: true
 *         description: ID of the evidence to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: The details of the evidence in question
 *         content:
 *           application/json:
 *             example:
 *               {
 *                   "id": 1,
 *                   "description": "Some evidence we found",
 *                   "type": "normal"
 *               }
 *       '404':
 *         description: Case not found
 */
app.get('/evidences/:id', async (req, res) => {
  const evidence = await Database.manager.findOne(Evidence, {where: {id: Number(req.params.id)}})
  
  if (evidence) {
    res.send(evidence);
    return
  }

  res.status(404).send('Evidence not found')
});

/**
 * @swagger
 * /evidences/{evidenceId}:
 *   put:
 *     summary: Updates an evidence file
 *     parameters:
 *       - in: path
 *         name: evidenceId
 *         required: true
 *         description: The id of the evidence to update
 *         schema:
 *           type: string
 *       - in: body
 *         name: description
 *         required: true
 *         description: The description of the evidence
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: The details of the updated evidence
 *         content:
 *           application/json:
 *             example:
 *               {
 *                   "id": 1,
 *                   "description": "Some evidence we found",
 *                   "type": "normal"
 *               }
 *       '404':
 *         description: Evidence not found
 */
app.put('/evidences/:id', async (req, res) => {
  const evidence = await Database.manager.findOne(Evidence, {where: {id: Number(req.params.id)}})
  
  if (!evidence) {
    res.status(404).send('Evidence not found')
    return
  }

  const updatedvidence = await Database.manager.save(Evidence, {id: evidence.id, description: req.body.description})

  res.send(updatedvidence);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, async () => {
  await Database.initialize()

  console.log(`Server is running on port ${port}`);
});
